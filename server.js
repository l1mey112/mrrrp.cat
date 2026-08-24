const http = require("http");
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "comments.json");

if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]");
}

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url === "/comments") {
        res.end(fs.readFileSync(file, "utf8"));
        return;
    }

    if (req.method === "POST" && req.url === "/comments") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                const text = String(data.text || "").trim();

                if (!text || text.length > 500) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "Invalid comment" }));
                    return;
                }

                const comments = JSON.parse(fs.readFileSync(file, "utf8"));

                const comment = {
                    id: Date.now(),
                    text,
                    x: Number(data.x) || 0,
                    y: Number(data.y) || 0,
                    rotation: Number(data.rotation) || 0
                };

                comments.push(comment);
                fs.writeFileSync(file, JSON.stringify(comments, null, 2));

                res.end(JSON.stringify(comment));
            } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid request" }));
            }
        });

        return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Comment server running on port 3000");
});
