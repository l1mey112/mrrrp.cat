// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
// https://github.com/sandersn/manual/blob/master/Strict-JSDoc.md
/// <reference path="vendor/njs.d.ts" />
/*
put da image in the bag bor
*/

import fs from 'fs'
import { html } from './vendor/html.js'

const DIR = 'media/gallery'
const IMG = /[.](png|jpe?g|gif|webp)$/i

/** @param {NginxHTTPRequest} r */
function render(r) {
    let files
    try {
        files = fs.readdirSync(DIR)
    } catch (e) {
        files = []
    }

    const imgs = files
        .filter(name => IMG.test(name) && !name.startsWith('.'))
        .sort()
        .map(name => html`<a href="/media/gallery/${name}"><img src="/media/gallery/${name}" alt="${name}" loading="lazy"></a>`)

    const out = imgs.length ? html`${imgs}` : html`<p>where my photos go</p>`
    r.return(200, out.toString())
}

export default { render }
