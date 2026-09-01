/* Orchestrator worker: splits files into blocks and distributes across
 * parallel block workers. Falls back to single-threaded for small files.
 *
 * All .odz format knowledge lives in the C wrapper (odzip_web.c).
 * This file only calls C helper functions via WASM, never parses .odz directly.
 *
 * Messages in:  { type: "compress"|"decompress", buffer: ArrayBuffer, filename: string }
 * Messages out: { type: "progress", percent: number }
 *               { type: "done", buffer: ArrayBuffer, originalSize, resultSize, timeMs }
 *               { type: "error", message: string } */

var NUM_WORKERS = Math.min(navigator.hardwareConcurrency || 4, 8);

var blockWorkers = null;
var Module = null;
var BLOCK_SIZE = 0;
var HEADER_SIZE = 0;

/* ---- WASM module (used for single-threaded path + format helpers) ---- */

async function ensureModule() {
    if (!Module) {
        importScripts("wasm/odzip.js");
        Module = await createOdzipModule({ locateFile: function (path) { return "wasm/" + path; } });
        BLOCK_SIZE = Module._odz_web_block_size();
        HEADER_SIZE = Module._odz_web_header_size();
    }
}

/* ---- Single-threaded path ---- */

function compressSingle(input) {
    var inputPtr = Module._malloc(input.length);
    Module.HEAPU8.set(input, inputPtr);
    var outLenPtr = Module._malloc(4);
    var outPtr = Module._odz_web_compress(inputPtr, input.length, outLenPtr);
    Module._free(inputPtr);
    if (outPtr === 0) { Module._free(outLenPtr); return null; }
    var outLen = Module.getValue(outLenPtr, "i32");
    Module._free(outLenPtr);
    var result = new Uint8Array(outLen);
    result.set(Module.HEAPU8.subarray(outPtr, outPtr + outLen));
    Module._odz_web_free(outPtr);
    return result;
}

function decompressSingle(input) {
    var inputPtr = Module._malloc(input.length);
    Module.HEAPU8.set(input, inputPtr);
    var outLenPtr = Module._malloc(4);
    var outPtr = Module._odz_web_decompress(inputPtr, input.length, outLenPtr);
    Module._free(inputPtr);
    if (outPtr === 0) { Module._free(outLenPtr); return null; }
    var outLen = Module.getValue(outLenPtr, "i32");
    Module._free(outLenPtr);
    var result = new Uint8Array(outLen);
    result.set(Module.HEAPU8.subarray(outPtr, outPtr + outLen));
    Module._odz_web_free(outPtr);
    return result;
}

/* ---- Parallel path ---- */

function initBlockWorkers() {
    if (blockWorkers) return;
    blockWorkers = [];
    for (var i = 0; i < NUM_WORKERS; i++) {
        blockWorkers.push(new Worker("block-worker.js"));
    }
}

function runBlockJobs(jobs) {
    return new Promise(function (resolve, reject) {
        var results = new Array(jobs.length);
        var completed = 0;
        var nextJob = 0;

        function sendNext(workerIdx) {
            if (nextJob >= jobs.length) return;
            var job = jobs[nextJob++];
            var w = blockWorkers[workerIdx];

            w.onmessage = function (e) {
                if (e.data.type === "block-done") {
                    results[e.data.index] = new Uint8Array(e.data.data);
                    completed++;
                    self.postMessage({ type: "progress", percent: Math.round((completed / jobs.length) * 100) });
                    if (completed === jobs.length) resolve(results);
                    else sendNext(workerIdx);
                } else if (e.data.type === "block-error") {
                    reject(new Error(e.data.message));
                }
            };

            var buf = job.data instanceof ArrayBuffer ? job.data.slice(0) : job.data.buffer.slice(0);
            var msg = { type: job.type, data: buf, index: job.index };
            if (job.rawSize !== undefined) msg.rawSize = job.rawSize;
            w.postMessage(msg, [buf]);
        }

        for (var i = 0; i < Math.min(NUM_WORKERS, jobs.length); i++) {
            sendNext(i);
        }
    });
}

async function compressParallel(input) {
    initBlockWorkers();

    /* Split into blocks (size from C) */
    var jobs = [];
    for (var offset = 0; offset < input.length; offset += BLOCK_SIZE) {
        var end = Math.min(offset + BLOCK_SIZE, input.length);
        jobs.push({
            type: "compress-block",
            data: input.slice(offset, end),
            index: jobs.length,
        });
    }

    var blocks = await runBlockJobs(jobs);

    /* Assemble .odz file using C helpers for header + flag manipulation */
    var totalBlockBytes = 0;
    for (var i = 0; i < blocks.length; i++) totalBlockBytes += blocks[i].length;

    var output = new Uint8Array(HEADER_SIZE + totalBlockBytes);

    /* Write file header via C */
    var hdrPtr = Module._malloc(HEADER_SIZE);
    var sizeLo = input.length >>> 0;
    var sizeHi = Math.floor(input.length / 0x100000000) >>> 0;
    Module._odz_web_write_header(hdrPtr, sizeLo, sizeHi);
    output.set(Module.HEAPU8.subarray(hdrPtr, hdrPtr + HEADER_SIZE), 0);
    Module._free(hdrPtr);

    /* Concatenate blocks, fix is_last flags via C */
    var pos = HEADER_SIZE;
    for (var i = 0; i < blocks.length; i++) {
        output.set(blocks[i], pos);

        /* Use C helper to set/clear is_last on the flags byte in the output buffer.
         * We write the block into WASM memory temporarily for the flag fix. */
        var flagPtr = Module._malloc(1);
        Module.HEAPU8[flagPtr] = output[pos];
        Module._odz_web_set_last(flagPtr, i === blocks.length - 1 ? 1 : 0);
        output[pos] = Module.HEAPU8[flagPtr];
        Module._free(flagPtr);

        pos += blocks[i].length;
    }

    return output;
}

async function decompressParallel(input) {
    initBlockWorkers();

    /* Parse block boundaries via C helper */
    var dataPtr = Module._malloc(input.length);
    Module.HEAPU8.set(input, dataPtr);
    var numBlocksPtr = Module._malloc(4);

    var infoPtr = Module._odz_web_parse_blocks(dataPtr, input.length, numBlocksPtr);
    Module._free(dataPtr);

    if (infoPtr === 0) {
        Module._free(numBlocksPtr);
        throw new Error("failed to parse block boundaries");
    }

    var numBlocks = Module.getValue(numBlocksPtr, "i32");
    Module._free(numBlocksPtr);

    /* Read the packed [offset, length, rawSize] triples */
    var jobs = [];
    for (var i = 0; i < numBlocks; i++) {
        var offset = Module.HEAPU32[(infoPtr >> 2) + i * 3];
        var length = Module.HEAPU32[(infoPtr >> 2) + i * 3 + 1];
        var rawSize = Module.HEAPU32[(infoPtr >> 2) + i * 3 + 2];
        jobs.push({
            type: "decompress-block",
            data: input.slice(offset, offset + length),
            index: i,
            rawSize: rawSize,
        });
    }
    Module._odz_web_free(infoPtr);

    var blocks = await runBlockJobs(jobs);

    /* Concatenate decompressed blocks */
    var totalLen = 0;
    for (var i = 0; i < blocks.length; i++) totalLen += blocks[i].length;
    var output = new Uint8Array(totalLen);
    var pos = 0;
    for (var i = 0; i < blocks.length; i++) {
        output.set(blocks[i], pos);
        pos += blocks[i].length;
    }

    return output;
}

/* ---- Main handler ---- */

self.onmessage = async function (e) {
    var type = e.data.type;
    var input = new Uint8Array(e.data.buffer);
    var start = performance.now();

    try {
        await ensureModule();
        var result;
        var numBlocks = Math.ceil(input.length / BLOCK_SIZE);

        if (type === "compress") {
            if (numBlocks <= 1) {
                self.postMessage({ type: "progress", percent: 0 });
                result = compressSingle(input);
                if (!result) throw new Error("compress failed");
                self.postMessage({ type: "progress", percent: 100 });
            } else {
                result = await compressParallel(input);
            }
        } else {
            /* Check if decompressed size exceeds browser limit.
             * >>> 0 converts signed i32 from WASM to unsigned. */
            var hdrPtr = Module._malloc(HEADER_SIZE);
            Module.HEAPU8.set(input.subarray(0, HEADER_SIZE), hdrPtr);
            var origSize = Module._odz_web_read_header_size(hdrPtr) >>> 0;
            Module._free(hdrPtr);
            if (origSize > 0x7FFFFFFF) {
                throw new Error("Decompressed file exceeds 2 GB. Use the CLI for large files.");
            }

            /* For decompression, parse block count via C helper */
            var dataPtr = Module._malloc(input.length);
            Module.HEAPU8.set(input, dataPtr);
            var nbPtr = Module._malloc(4);
            var infoPtr = Module._odz_web_parse_blocks(dataPtr, input.length, nbPtr);
            Module._free(dataPtr);
            var nb = infoPtr ? Module.getValue(nbPtr, "i32") : 1;
            Module._free(nbPtr);
            if (infoPtr) Module._odz_web_free(infoPtr);

            if (nb <= 1) {
                self.postMessage({ type: "progress", percent: 0 });
                result = decompressSingle(input);
                if (!result) throw new Error("decompress failed");
                self.postMessage({ type: "progress", percent: 100 });
            } else {
                result = await decompressParallel(input);
            }
        }

        var timeMs = performance.now() - start;
        var buf = result.buffer;
        self.postMessage({
            type: "done",
            buffer: buf,
            originalSize: input.length,
            resultSize: result.length,
            timeMs: timeMs,
        }, [buf]);
    } catch (err) {
        var msg = err.message || String(err);
        if (msg.indexOf("ArrayBuffer") !== -1 || msg.indexOf("memory") !== -1 || msg.indexOf("OOM") !== -1) {
            msg = "File too large for browser. Use the CLI for large files.";
        }
        self.postMessage({ type: "error", message: msg });
    }
};
