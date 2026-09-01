(function () {
    "use strict";

    function isOdz(name) {
        return name.toLowerCase().endsWith(".odz");
    }

    function outputFilename(name, operation) {
        return operation === "compress" ? name + ".odz" : name.replace(/\.odz$/i, "");
    }

    if (typeof module !== "undefined") module.exports = { isOdz, outputFilename };
    if (typeof document === "undefined") return;

    function init() {
        var root = document.createElement("div");
        root.id = "odzip-overlay";
        root.hidden = true;
        root.setAttribute("role", "dialog");
        root.setAttribute("aria-modal", "true");
        root.setAttribute("aria-labelledby", "odzip-title");
        root.innerHTML = `
            <style>
                #odzip-overlay[hidden], #odzip-overlay [hidden] { display: none !important; }
                #odzip-overlay, #odzip-overlay * { box-sizing: border-box; }
                #odzip-overlay {
                    position: fixed; inset: 0; z-index: 2147483647; padding: 24px;
                    display: grid; place-items: center; background: rgb(10 10 20 / 88%);
                    color: #c8c8d0; font-family: -apple-system, system-ui, "Segoe UI", sans-serif;
                }
                #odzip-panel {
                    position: relative; width: min(440px, 100%); padding: 24px;
                    border: 1px solid #2a2a3e; border-radius: 8px; background: #1a1a2e;
                    text-align: center; box-shadow: 0 16px 60px #000a;
                }
                #odzip-title { margin: 0 0 24px; color: #888; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; }
                #odzip-close { position: absolute; top: 8px; right: 10px; padding: 4px 8px; border: 0; background: none; color: #888; font: inherit; font-size: 20px; line-height: 1; cursor: pointer; }
                #odzip-idle { padding: 48px 20px; border: 2px dashed #7a7aad; border-radius: 6px; cursor: pointer; }
                #odzip-idle p, #odzip-processing p, #odzip-done p { margin: 0; }
                #odzip-idle p { color: #888; font-size: 14px; pointer-events: none; }
                #odzip-processing { padding: 32px 0; }
                #odzip-processing-label { color: #888; font-size: 13px; }
                #odzip-processing-filename, #odzip-done-filename { margin-top: 4px !important; overflow-wrap: anywhere; font-size: 14px; }
                #odzip-progress-track { height: 3px; margin-top: 24px; overflow: hidden; border-radius: 2px; background: #2a2a3e; }
                #odzip-progress-bar { width: 0; height: 100%; border-radius: 2px; background: #7a7aad; transition: width .15s ease; }
                #odzip-progress-text { margin-top: 8px !important; color: #888; font-size: 12px; }
                #odzip-done { padding: 24px 0 8px; }
                #odzip-done-filename { margin-bottom: 16px !important; color: #888; font-size: 13px; }
                #odzip-done-sizes { font-size: 18px; font-weight: 500; }
                #odzip-done-ratio { margin-top: 4px !important; color: #7a7aad; font-size: 13px; }
                #odzip-done-time { margin: 2px 0 24px !important; color: #888; font-size: 12px; }
                #odzip-download { display: inline-block; padding: 8px 24px; border: 1px solid #7a7aad; border-radius: 4px; color: #c8c8d0; text-decoration: none; }
                #odzip-reset { display: block; margin: 16px auto 0; padding: 4px; border: 0; background: none; color: #888; font: inherit; font-size: 12px; cursor: pointer; }
                #odzip-error { margin-top: 16px !important; color: #d99; font-size: 13px; }
                #odzip-privacy { margin: 24px 0 0; color: #777; font-size: 10px; }
            </style>
            <div id="odzip-panel">
                <button id="odzip-close" type="button" aria-label="Close">&times;</button>
                <p id="odzip-title">odzip</p>
                <div id="odzip-idle">
                    <p>Drop a file to compress or decompress</p>
                    <input id="odzip-input" type="file" hidden>
                    <p id="odzip-error" hidden></p>
                </div>
                <div id="odzip-processing" hidden aria-live="polite">
                    <p id="odzip-processing-label">Compressing…</p>
                    <p id="odzip-processing-filename"></p>
                    <div id="odzip-progress-track"><div id="odzip-progress-bar"></div></div>
                    <p id="odzip-progress-text">0%</p>
                </div>
                <div id="odzip-done" hidden aria-live="polite">
                    <p id="odzip-done-filename"></p>
                    <p id="odzip-done-sizes"></p>
                    <p id="odzip-done-ratio"></p>
                    <p id="odzip-done-time"></p>
                    <a id="odzip-download" href="#">Download</a>
                    <button id="odzip-reset" type="button">Drop another file</button>
                </div>
                <p id="odzip-privacy">All processing happens in your browser. Your files never leave your device.</p>
            </div>`;
        document.body.appendChild(root);

        var idle = root.querySelector("#odzip-idle");
        var input = root.querySelector("#odzip-input");
        var processing = root.querySelector("#odzip-processing");
        var processingLabel = root.querySelector("#odzip-processing-label");
        var processingFilename = root.querySelector("#odzip-processing-filename");
        var progressBar = root.querySelector("#odzip-progress-bar");
        var progressText = root.querySelector("#odzip-progress-text");
        var done = root.querySelector("#odzip-done");
        var doneFilename = root.querySelector("#odzip-done-filename");
        var doneSizes = root.querySelector("#odzip-done-sizes");
        var doneRatio = root.querySelector("#odzip-done-ratio");
        var doneTime = root.querySelector("#odzip-done-time");
        var download = root.querySelector("#odzip-download");
        var reset = root.querySelector("#odzip-reset");
        var close = root.querySelector("#odzip-close");
        var error = root.querySelector("#odzip-error");
        var currentFile;
        var worker;
        var state = "idle";

        function formatBytes(bytes) {
            if (!bytes) return "0 B";
            var units = ["B", "KB", "MB", "GB"];
            var i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
            var value = bytes / Math.pow(1024, i);
            return (i ? value.toFixed(1) : value) + " " + units[i];
        }

        function showIdle() {
            state = "idle";
            root.hidden = false;
            idle.hidden = false;
            processing.hidden = true;
            done.hidden = true;
            close.hidden = false;
            error.hidden = true;
        }

        function hide() {
            if (state !== "processing") root.hidden = true;
        }

        function showError(message) {
            showIdle();
            error.textContent = message;
            error.hidden = false;
            setTimeout(function () { error.hidden = true; }, 4000);
        }

        function getWorker() {
            if (worker) return worker;
            worker = new Worker("/media/odzip/worker.js");
            worker.onmessage = function (event) {
                var message = event.data;
                if (message.type === "progress") {
                    progressBar.style.width = message.percent + "%";
                    progressText.textContent = message.percent + "%";
                } else if (message.type === "error") {
                    showError(message.message);
                } else if (message.type === "done") {
                    var operation = isOdz(currentFile.name) ? "decompress" : "compress";
                    var name = outputFilename(currentFile.name, operation);
                    if (download.href.startsWith("blob:")) URL.revokeObjectURL(download.href);
                    download.href = URL.createObjectURL(new Blob([message.buffer]));
                    download.download = name;
                    doneFilename.textContent = name;
                    doneSizes.textContent = formatBytes(message.originalSize) + " → " + formatBytes(message.resultSize);
                    doneRatio.hidden = operation !== "compress" || !message.originalSize;
                    if (!doneRatio.hidden) doneRatio.textContent = Math.round((1 - message.resultSize / message.originalSize) * 100) + "% smaller";
                    doneTime.textContent = message.timeMs < 1000 ? Math.round(message.timeMs) + "ms" : (message.timeMs / 1000).toFixed(1) + "s";
                    state = "done";
                    processing.hidden = true;
                    done.hidden = false;
                    close.hidden = false;
                    download.focus();
                }
            };
            worker.onerror = function () { showError("odzip failed"); };
            return worker;
        }

        function processFile(file) {
            if (file.size > 2 * 1024 * 1024 * 1024) {
                showError("File too large for browser. Use the CLI for files over 2 GB.");
                return;
            }
            currentFile = file;
            state = "processing";
            root.hidden = false;
            idle.hidden = true;
            processing.hidden = false;
            done.hidden = true;
            close.hidden = true;
            processingLabel.textContent = isOdz(file.name) ? "Decompressing…" : "Compressing…";
            processingFilename.textContent = file.name;
            progressBar.style.width = "0%";
            progressText.textContent = "0%";
            file.arrayBuffer().then(function (buffer) {
                var type = isOdz(file.name) ? "decompress" : "compress";
                getWorker().postMessage({ type: type, buffer: buffer, filename: file.name }, [buffer]);
            }).catch(function (reason) { showError(reason.message || String(reason)); });
        }

        function hasFiles(event) {
            return event.dataTransfer && Array.prototype.indexOf.call(event.dataTransfer.types, "Files") !== -1;
        }

        document.addEventListener("dragover", function (event) {
            if (!hasFiles(event)) return;
            event.preventDefault();
            if (root.hidden) showIdle();
        });
        document.addEventListener("dragleave", function (event) {
            if (event.relatedTarget === null && state === "idle") hide();
        });
        document.addEventListener("drop", function (event) {
            if (!hasFiles(event)) return;
            event.preventDefault();
            var file = event.dataTransfer.files[0];
            if (file) processFile(file);
        });
        idle.addEventListener("click", function () { input.click(); });
        input.addEventListener("change", function () {
            if (input.files[0]) processFile(input.files[0]);
            input.value = "";
        });
        close.addEventListener("click", hide);
        reset.addEventListener("click", function () {
            if (download.href.startsWith("blob:")) URL.revokeObjectURL(download.href);
            showIdle();
            hide();
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") hide();
        });
    }

    if (document.body) init();
    else document.addEventListener("DOMContentLoaded", init, { once: true });
})();
