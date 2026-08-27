// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
/// <reference path="vendor/njs.d.ts" />

import { md } from './vendor/html.js'
/*

https://mrrrp.cat/ring/l-m.dev
https://mrrrp.cat/ring/l-m.dev/next
https://mrrrp.cat/ring/l-m.dev/prev
https://mrrrp.cat/ring/l-m.dev/embed

*/

/** @param {NginxHTTPRequest} r */
function ring(r) {
    const res = parse_ring(r.uri)
    if (!res) {
        r.return(404)
        return
    }

    switch (res.cmd) {
    case "": ring_invite(r, res.host); break
    case "next": r.return(501); break
    case "prev": r.return(501); break
    case "embed": r.return(501); break
    }
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
    <meta property="og:description" content="click in here to get all the tools you need to set up!">
</head>
<body>

# hello!

we're going to invite you (${host}) to mrrrp.cat webring

1. **option 1.** please find a place to put the buttons on your site
    - next: \`<a href="https://mrrrp.cat/ring/${host}/next">/next</a>\`
    - prev: \`<a href="https://mrrrp.cat/ring/${host}/prev">/prev</a>\`

2. **option 2.** please use this iframe

\`\`\`
<iframe style="width: 90%; height: 3rem; border: none;" src="https://mrrrp.cat/ring/${host}/embed"></iframe>
\`\`\`

</body>
</html>
    `

    r.headersOut['Content-Type'] = 'text/html'
    r.return(200, h.toString())
}

const RING_RE = /^\/ring\/([a-z0-9-]+(?:\.[a-z0-9-]+)+)(?:\/(next|prev|embed))?\/?$/i;

/**
 * @param {string} uri
*/
function parse_ring(uri) {
    const m = RING_RE.exec(uri)
    if (!m) return null
    return {
        host: m[1],
        cmd: /** @type {'' | 'next' | 'prev' | 'embed'} */ (m[2] ?? "")
    }
}

export default { ring };
