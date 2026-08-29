// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
// https://github.com/sandersn/manual/blob/master/Strict-JSDoc.md
/// <reference path="vendor/njs.d.ts" />

import fs from 'fs'
import { html, md } from './vendor/html.js'
/*
- /ring
- /ring/random
- /ring/list
- /ring/example.com/invite
- /ring/example.com/iframe
- /ring/example.com/next
- /ring/example.com/prev
*/

const cate_images = fs.readdirSync('media/cat128').filter(f => f.endsWith('.png'));

const webring = [
    'l-m.dev',
    'violetronics.dev',
    'unemployed.foo',
    'jstnc.dev',
    'isobel.zip',
    'odpay.net',
    'logykk.stream',
    'zopolis4.github.io',
    // your site here!
]

/** @param {NginxHTTPRequest} r */
function ring(r) {
    // /ring
    // /ring/random
    // /ring/list
    switch (r.uri) {
    case '/ring':
        return r.return(302, '//mrrrp.cat/')
    case '/ring/random':
        const idx = Math.floor(Math.random()*webring.length)
        return r.return(302, `//${webring[idx]}/`)
    case '/ring/list':
        return fun_ring_list(r)
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
            font-family: "Comic Sans MS", "Comic Sans", sans-serif;
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

also, please see [#bad-iframe](#bad-iframe) if there are other issues

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

<h1 id="bad-iframe">debugging bad iframe styles</h1>

## weird text colours

you can set a \`?theme=dark\` (the default is \`?theme=light\`, leave it empty if you want this) which will change the text/link colour of your embed. the iframe is transparent, this won't change the background.

## mismatched colour

the iframe actually has a transparent background. the image you're seeing below here should never ever happen.

![mrrrp.cat webring where the iframe background colour (white) is mismatched to the website background (dark)](/media/webring_bad_iframe.png)

this took me a while to figure out. the CSS Color Adjust spec basically says that if an iframe has a \`color-scheme\` that is different to the surrounding page it will rerender with a different opaque background.

if you set any of these offending objects

- \`<meta name=color-scheme content="light dark">\`
- \`.webring-frame { color-scheme: light dark }\` set on an iframe

such that the color-scheme is different to the one set on the iframe (which is none!), you need to set the \`?scheme=\` parameter. below is an example:

<pre><code>${`<iframe src="https://mrrrp.cat/ring/${host}/iframe?theme=dark&scheme=light%20dark"
    title="mrrrp.cat webring"
    loading="lazy"
    style="display:block;width:100%;height:56px;margin:0 auto;border:0"></iframe>`}</code></pre>

probably related issues:

- https://github.com/w3c/csswg-drafts/issues/4772
- https://github.com/w3c/csswg-drafts/issues/13843

## other issues? you can read the code

https://github.com/l1mey112/mrrrp.cat/blob/master/ngx/ngx_webring.js

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
            html, body { height: 100%; margin: 0; background: transparent; overflow: hidden; }
            body {
                box-sizing: border-box;
                padding: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                font: 1rem/1.5 "Comic Sans MS", "Comic Sans", sans-serif;
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
            const q = new URLSearchParams(location.search)
            const t = q.get('theme')
            if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t
            document.documentElement.style.colorScheme = q.get('scheme')
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

/**
 * @template T
 * @param {T[]} arr
 */
function new_array_shuffled(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const webring_random = new_array_shuffled(webring)
const cate_images_random = new_array_shuffled(cate_images)

/**
 * @param {NginxHTTPRequest} r
 */
function fun_ring_list(r) {
    const htmls = []

    let cate = 0
    for (let i = 0; i < webring_random.length; i++) {
        cate = (cate + 1) % cate_images_random.length
        
        htmls.push(html`
            <li>
            <img src="/media/cat128/${cate_images_random[cate]}" alt="">
            <a href="//${webring_random[i]}/">${webring_random[i]}</a>
            </li>
        `)
    }
    const h = html`
        <style>
            .chips {
                display: flex;
                flex-wrap: wrap;
                gap: .75rem;
                padding: 0;
            }
            .chips li {
                display: flex;
                align-items: center;
                gap: .5rem;
                margin: 0;
            }
            .chips img {
                width: 64px;
                height: 64px;
                object-fit: cover;
            }
        </style>
        <ul class="chips">${htmls}</ul>
    `

    r.headersOut['Content-Type'] = 'text/html'
    r.return(200, h.toString())
}

export default { ring };
