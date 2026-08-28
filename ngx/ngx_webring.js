// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
/// <reference path="vendor/njs.d.ts" />

import { html, md } from './vendor/html.js'
/*

https://mrrrp.cat/ring/l-m.dev/invite
https://mrrrp.cat/ring/l-m.dev/next
https://mrrrp.cat/ring/l-m.dev/prev
https://mrrrp.cat/ring/l-m.dev/iframe

*/

const webring = [
    'l-m.dev',
    'violetronics.dev',
]

/** @param {NginxHTTPRequest} r */
function ring(r) {
    // /ring
    // /ring/random
    switch (r.uri) {
    case '/ring':
        return r.return(302, '//mrrrp.cat/')
    case '/ring/random':
        const idx = Math.floor(Math.random()*webring.length)
        return r.return(302, `//${webring[idx]}/`)
    }

    // /ring/l-m.dev/{next,prev,invite,iframe}
    const res = parse_ring(r.uri)
    if (!res) {
        r.return(404)
        return
    }

    if (res.cmd == 'invite') {
        return ring_invite(r, res.host)
    }

    let idx = webring.indexOf(res.host)
    if (idx === -1) {
        r.return(404)
        return
    }

    if (res.cmd == 'iframe') {
        return ring_iframe(r, res.host)
    }

    // prev is as it is because modulo may be negative
    switch (res.cmd) {
    case "next": idx = (idx + 1) % webring.length; break
    case "prev": idx = (idx - 1 + webring.length) % webring.length; break
    }
    r.return(302, '//' + webring[idx] + '/')
}

/**
 * @param {NginxHTTPRequest} r
 * @param {string} host
 */
function ring_invite(r, host) {
    const h = md`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>invite ${host}</title>
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_AU">
    <meta property="og:title" content="invite ${host} to mrrrp.cat webring">
    <meta property="og:description" content="${host} -> click to get all the tools you need to set up!">
</head>
<body>

# hello!

we're going to invite you (${host}) to mrrrp.cat webring

1. **option 1.** please find a place to put the buttons on your site
    - next: \`<a href="https://mrrrp.cat/ring/${host}/next">/next</a>\`
    - prev: \`<a href="https://mrrrp.cat/ring/${host}/prev">/prev</a>\`

2. **option 2.** please use this iframe

\`\`\`
<iframe src="https://mrrrp.cat/ring/${host}/iframe"
    title="mrrrp.cat webring"
    loading="lazy"
    style="display:block;width:100%;height:56px;margin:0 auto;border:0"></iframe>
\`\`\`

</body>
</html>
    `

    r.headersOut['Content-Type'] = 'text/html'
    r.return(200, h.toString())
}

/**
 * @param {NginxHTTPRequest} r
 * @param {string} host
 */
function ring_iframe(r, host) {
    // /ring/l-m.dev/iframe
    // /ring/l-m.dev/iframe?theme=dark
    const h = html`
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            html, body { height: 100%; margin: 0; background: transparent; }
            body {
                box-sizing: border-box;
                padding: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                font: 1rem/1.5 "Comic Sans MS", "Comic Sans", cursive;
                color: #111;
            }
            a { color: #0000EE; white-space: nowrap; }
            a:hover, a:focus { color: #000; }
            .sep { opacity: .5; padding: 0 .15em; }
            [data-theme="dark"] { color: #eee; }
            [data-theme="dark"] a { color: #5aa2ff; }
            [data-theme="dark"] a:hover, [data-theme="dark"] a:focus { color: #fff; }
            @media (max-width: 24em) {
                body { padding: 6px; font-size: .875rem; }
            }
        </style>
        <script>
            if (new URLSearchParams(location.search).get('theme') === 'dark')
                document.documentElement.dataset.theme = 'dark';
        </script>
        <nav>
            <a rel="prev" href="//mrrrp.cat/ring/${host}/prev" target="_top">${'<< prev'}</a>
            <span class="sep" aria-hidden="true">|</span>
            <a href="//mrrrp.cat/ring" target="_top">mrrrp.cat webring</a>
            (<a href="//mrrrp.cat/ring/random" target="_top">random</a>)
            <span class="sep" aria-hidden="true">|</span>
            <a rel="next" href="//mrrrp.cat/ring/${host}/next" target="_top">${'next >>'}</a>
        </nav>
    `

    r.headersOut['Content-Type'] = 'text/html'
    r.return(200, h.toString())
}

const RING_RE = /^\/ring\/([a-z0-9-]+(?:\.[a-z0-9-]+)+)(?:\/(invite|next|prev|iframe))\/?$/i;

/**
 * @param {string} uri
 */
function parse_ring(uri) {
    const m = RING_RE.exec(uri)
    if (!m) return null
    return {
        host: m[1],
        cmd: /** @type {'invite' | 'next' | 'prev' | 'iframe'} */ (m[2] ?? "")
    }
}

export default { ring };
