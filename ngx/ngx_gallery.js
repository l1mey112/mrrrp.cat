// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
// https://github.com/sandersn/manual/blob/master/Strict-JSDoc.md
/// <reference path="vendor/njs.d.ts" />
/*
put da image in the bag bor
*/

import fs from 'fs'
import { html } from './vendor/html.js'
import { new_array_shuffled } from './vendor/util.js'

const DIR = 'media/gallery'
const IMG = /[.](png|jpe?g|gif|webp)$/i

/** @type {string[]} */
let files
try {
    files = fs.readdirSync(DIR)
} catch (e) {
    files = []
}

/** @param {NginxHTTPRequest} r */
function render(r) {
    const imgs = files
        .filter(name => IMG.test(name) && !name.startsWith('.'))
        .sort()
        .map(name => html`<a href="/media/gallery/${name}"><img src="/media/gallery/${name}" alt="${name}" loading="lazy"></a>`)

    const out = imgs.length ? html`${imgs}` : html`<p>where my photos go</p>`

    r.headersOut['Content-Type'] = 'text/html'
    r.return(200, out.toString())
}

/** @param {NginxHTTPRequest} r */
function head(r) {
    const files_shuffle = new_array_shuffled(files)

    const metas = [html`
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://mrrrp.cat/gallery">
        <meta property="og:locale" content="en_AU">
    `]
    for (const file of files_shuffle) {
        metas.push(html`
            <meta property="og:image" content="/media/gallery/${file}">
        `)
    }

    r.headersOut['Content-Type'] = 'text/html'
    return r.return(200, html`${metas}`.toString())
}

export default { render, head }
