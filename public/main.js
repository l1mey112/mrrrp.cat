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
    ...["http://burp/cert", "http://localhost:8080/cert"].map(cert),
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
