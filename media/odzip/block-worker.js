/* Block worker: compresses or decompresses a single block using its own WASM instance.
 * All .odz format knowledge lives in the C wrapper (odzip_web.c), not here. */

let Module = null;

async function ensureModule() {
    if (!Module) {
        importScripts("wasm/odzip.js");
        Module = await createOdzipModule({ locateFile: function (path) { return "wasm/" + path; } });
    }
}

self.onmessage = async function (e) {
    var msg = e.data;
    try {
        await ensureModule();

        if (msg.type === "compress-block") {
            /* Compress the chunk via odz_web_compress (produces full .odz with 1 block),
             * then use odz_web_strip_header to get just the block bytes. */
            var input = new Uint8Array(msg.data);
            var inputPtr = Module._malloc(input.length);
            Module.HEAPU8.set(input, inputPtr);
            var outLenPtr = Module._malloc(4);

            var outPtr = Module._odz_web_compress(inputPtr, input.length, outLenPtr);
            Module._free(inputPtr);
            if (outPtr === 0) {
                Module._free(outLenPtr);
                self.postMessage({ type: "block-error", index: msg.index, message: "compress failed" });
                return;
            }
            var outLen = Module.getValue(outLenPtr, "i32");
            Module._free(outLenPtr);

            /* Strip the 12-byte file header via C helper */
            var blockLenPtr = Module._malloc(4);
            var blockPtr = Module._odz_web_strip_header(outPtr, outLen, blockLenPtr);
            Module._odz_web_free(outPtr);

            if (blockPtr === 0) {
                Module._free(blockLenPtr);
                self.postMessage({ type: "block-error", index: msg.index, message: "strip header failed" });
                return;
            }
            var blockLen = Module.getValue(blockLenPtr, "i32");
            Module._free(blockLenPtr);

            var block = new Uint8Array(blockLen);
            block.set(Module.HEAPU8.subarray(blockPtr, blockPtr + blockLen));
            Module._odz_web_free(blockPtr);

            self.postMessage(
                { type: "block-done", data: block.buffer, index: msg.index },
                [block.buffer]
            );

        } else if (msg.type === "decompress-block") {
            /* Wrap the block in a fake .odz file via C helper, then decompress */
            var blockData = new Uint8Array(msg.data);
            var blockPtr = Module._malloc(blockData.length);
            Module.HEAPU8.set(blockData, blockPtr);
            var wrappedLenPtr = Module._malloc(4);

            var wrappedPtr = Module._odz_web_wrap_block(
                blockPtr, blockData.length, msg.rawSize, wrappedLenPtr
            );
            Module._free(blockPtr);

            if (wrappedPtr === 0) {
                Module._free(wrappedLenPtr);
                self.postMessage({ type: "block-error", index: msg.index, message: "wrap block failed" });
                return;
            }
            var wrappedLen = Module.getValue(wrappedLenPtr, "i32");
            Module._free(wrappedLenPtr);

            /* Decompress the fake .odz file */
            var outLenPtr = Module._malloc(4);
            var outPtr = Module._odz_web_decompress(wrappedPtr, wrappedLen, outLenPtr);
            Module._odz_web_free(wrappedPtr);

            if (outPtr === 0) {
                Module._free(outLenPtr);
                self.postMessage({ type: "block-error", index: msg.index, message: "decompress failed" });
                return;
            }
            var outLen = Module.getValue(outLenPtr, "i32");
            Module._free(outLenPtr);

            var result = new Uint8Array(outLen);
            result.set(Module.HEAPU8.subarray(outPtr, outPtr + outLen));
            Module._odz_web_free(outPtr);

            self.postMessage(
                { type: "block-done", data: result.buffer, index: msg.index },
                [result.buffer]
            );
        }
    } catch (err) {
        self.postMessage({ type: "block-error", index: msg.index, message: err.message || String(err) });
    }
};
