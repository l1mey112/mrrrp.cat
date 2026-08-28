// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
/// <reference path="vendor/njs.d.ts" />

import fs from 'fs'
import { html, md } from './vendor/html.js'
/*

https://mrrrp.cat/ring/l-m.dev/invite
https://mrrrp.cat/ring/l-m.dev/next
https://mrrrp.cat/ring/l-m.dev/prev
https://mrrrp.cat/ring/l-m.dev/iframe

*/

const cate_images = fs.readdirSync('media/cat128').filter(f => f.endsWith('.png'));

const webring = [
    'l-m.dev',
    'violetronics.dev',
    'unemployed.foo',
    // your site here!
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
    // media/webring_preview.png
    
    const h = md`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>invite ${host}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css">
    <style>
        body {
            padding: 10px;
            min-height: 100vh;
            background: #111;
            color: white;
            font-family: "Comic Sans MS", "Comic Sans", cursive;
            /* justify-content: center; */
        }
    </style>
    <meta property="og:type" content="website">
    <meta property="og:locale" content="en_AU">
    <meta property="og:title" content="invite ${host} to mrrrp.cat webring">
    <meta property="og:description" content="${host} -> click to get all the tools you need to set up!">
    <meta property="og:image" content="https://mrrrp.cat/media/webring_preview.png">
    <meta property="og:image:type" content="image/png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="https://mrrrp.cat/media/webring_preview.png">
</head>
<body>

# hello!

we're going to invite you (${host}) to mrrrp.cat webring

1. **option 1.** please find a place to put the buttons on your site
    - next: \`<a href="https://mrrrp.cat/ring/${host}/next">/next</a>\`
    - prev: \`<a href="https://mrrrp.cat/ring/${host}/prev">/prev</a>\`

2. **option 2 (preferred!!).** please use this iframe

\`\`\`
<iframe src="https://mrrrp.cat/ring/${host}/iframe"
    title="mrrrp.cat webring"
    loading="lazy"
    style="display:block;width:100%;height:56px;margin:0 auto;border:0"></iframe>
\`\`\`

<details>
<summary>if the text colours aren't nice enough please try <code>?theme=dark</code> !!</summary>

<pre><code>${`<iframe src="https://mrrrp.cat/ring/${host}/iframe?theme=dark"
    title="mrrrp.cat webring"
    loading="lazy"
    style="display:block;width:100%;height:56px;margin:0 auto;border:0"></iframe>`}</code></pre>
</details>

# final step!

we need to get you onto the webring array inside the code so we can route to you

![the webring array in code](/media/webring_array_example.png)

1. if you have push access, great! edit the [ngx_webring.js](https://github.com/l1mey112/mrrrp.cat/blob/master/ngx/ngx_webring.js) file in the [l1mey112/mrrrp.cat](https://github.com/l1mey112/mrrrp.cat) repo and add your site

2. if you don't have push access, that's okay! make a PR to [l1mey112/mrrrp.cat](https://github.com/l1mey112/mrrrp.cat) adding your domain to the file.
  also we can give you push access if we trust you

https://github.com/l1mey112/mrrrp.cat/blob/master/ngx/ngx_webring.js


**note!** if you don't like the iframe, you can

- add another route, maybe /iframe2
- add more functionality!
- add whatever you want! the code should be simple enough!

</body>
</html>`

    r.headersOut['Content-Type'] = 'text/html'
    r.return(200, h.toString())
}

/**
 * @param {NginxHTTPRequest} r
 * @param {string} host
 */
function ring_iframe(r, host) {
    const n = cate_images.length
    // generate two distinct integers with some weird ahh code
    const a = Math.random()*n|0
    const b = (a + 1 + Math.random()*(n-1)|0) % n

    // TODO(liam): DRY
    const idx_next = (webring.indexOf(host) + 1) % webring.length
    const idx_prev = (webring.indexOf(host) - 1 + webring.length) % webring.length

    // /ring/l-m.dev/iframe
    // /ring/l-m.dev/iframe?theme=dark
    const h = html`
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            html, body { height: 100%; margin: 0; background: transparent; color-scheme: light dark; overflow: hidden; }
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
            @media (prefers-color-scheme: dark) {
                body { color: #eee; }
                a { color: #5aa2ff; }
                a:hover, a:focus { color: #fff; }
            }
            [data-theme="light"] { color: #111; }
            [data-theme="light"] a { color: #0000EE; }
            [data-theme="light"] a:hover, [data-theme="light"] a:focus { color: #000; }
            [data-theme="dark"] { color: #eee; }
            [data-theme="dark"] a { color: #5aa2ff; }
            [data-theme="dark"] a:hover, [data-theme="dark"] a:focus { color: #fff; }
            @media (max-width: 24em) {
                body { padding: 6px; font-size: .875rem; }
            }
            nav { white-space: nowrap; }
            nav img {
                height: 1.5em;
                width: auto;
                vertical-align: middle;
            }
            @media (max-width: 20em) {
                body { font-size: .75rem; }
                nav img { display: none; }
            }
        </style>
        <script>
            const t = new URLSearchParams(location.search).get('theme')
            if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t
        </script>
        <nav>
            <a rel="prev" href="//mrrrp.cat/ring/${host}/prev" target="_top">${`<< ${webring[idx_prev]}`}</a> <img src="//mrrrp.cat/media/cat128/${cate_images[a]}" alt="cute cat">
            <span class="sep" aria-hidden="true">|</span>
            <a href="//mrrrp.cat/ring" target="_top">mrrrp.cat webring</a>
            (<a href="//mrrrp.cat/ring/random" target="_top">random</a>)
            <span class="sep" aria-hidden="true">|</span>
            <img src="//mrrrp.cat/media/cat128/${cate_images[b]}" alt="cute cat"> <a rel="next" href="//mrrrp.cat/ring/${host}/next" target="_top">${`${webring[idx_next]} >>`}</a>
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
