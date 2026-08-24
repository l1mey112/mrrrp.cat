marked.setOptions({ breaks: true });
marked.use({
    renderer: {
        html(token) { return basicesc(token.text || ""); }
    }
});

const rabbbase = "https://superinterface.ai/api/cloud/messages";
const public_key = "6ef3af86-1822-44c7-b854-e46e54207207";
const asstid = "70e3da19-25c4-49ae-a4a9-cb729e4f38b2";
const threadid = crypto.randomUUID();
let sendingornah = false;

function rsend(e) {
    e.preventDefault();
    const input = document.getElementById("rabbi-input");
    const text = input.value.trim();
    if (!text || sendingornah) return false;
    input.value = "";
    sendingornah = true;

    const msgs = document.getElementById("rabbi-msgs");
    msgs.innerHTML += `<div class="u"><b>you:</b> ${basicesc(text)}</div>`;
    const loading = document.createElement("div");
    loading.className = "a";
    loading.textContent = "rabbi is contemplating...";

    msgs.append(loading);
    msgs.scrollTop = msgs.scrollHeight;

    fetch(rabbbase, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
            publicApiKey: public_key,
            assistantId: asstid,
            content: [{ type: "text", text }],
            threadId: threadid,
        })
    })
    .then(r => r.text())
    .then(raw => {
        const reply = shitparse(raw);
        // i dont give a fuck xss if oyu want and are willing to try rabbai
        loading.innerHTML = `<b>rabbi:</b> ` + marked.parse(reply);
        msgs.scrollTop = msgs.scrollHeight;
    })
    .catch(() => {
        loading.innerHTML = `<b>rabbi:</b> <i>oy! something went wrong!</i>`;
    })
    .finally(() => { sendingornah = false; });

    return false;
}

function shitparse(raw) {
    const events = [];
    let i = 0;
    while (i < raw.length) {
        // console.log(i)
        while (i < raw.length && raw[i].trim() === "") i++;
        if (i >= raw.length) break;
        try {
            let depth = 0, start = i;
            if (raw[i] !== "{") { i++; continue; }
            console.log("depth")
            for (; i < raw.length; i++) {
                if (raw[i] === "{") depth++;
                else if (raw[i] === "}") { depth--; if (depth === 0) { i++; break; } }
            }
            events.push(JSON.parse(raw.substring(start, i)));
        } catch { i++; }
    }
    for (const ev of events) {
        if (ev.event !== "thread.message.completed") continue;
        for (const c of (ev.data?.content || [])) {
            if (c.type === "text") {
                const t = c.text?.value || c.text?.text || (typeof c.text === "string" ? c.text : "");
                if (t) return t;
            }
        }
    }
    return "no res";
}

function basicesc(s) {
    const d = document.createElement("span");
    d.textContent = s;
    return d.innerHTML;
}
