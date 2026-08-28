// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
// https://github.com/sandersn/manual/blob/master/Strict-JSDoc.md
/// <reference path="vendor/njs.d.ts" />
/*
we can do some cool thing to repurpose the sitemap.xml to add a cool
rendered list on the frontpage and add attribution to peoples things

need "ssi on;" in nginx per route, and use

    <!--# include virtual="/sitemap" -->

inside html to include a page. then we can

    location /sitemap {
        internal;
        js_content cool_sitemap.render;
    }

in nginx.

- https://en.wikipedia.org/wiki/Server_Side_Includes
- https://nginx.org/en/docs/http/ngx_http_ssi_module.html
*/

import fs from 'fs'
import xml from 'xml'
import { html } from './vendor/html.js'

/** @param {NginxHTTPRequest} r */
function render(r) {
    const { $root: sitemap } = xml.parse(fs.readFileSync('sitemap.xml', 'utf8'))

    /*
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://mrrrp.cat/</loc>
            <mrrrp:authors>l-m neel julia violet evan justin max everyoneeeee mrrrrrp</mrrrp:authors>
        </url>
    </urlset>
    */
    
    const htmls = []

    for (const url_elms of sitemap.$tags ?? []) {
        // these are <url> elements
        const loc = url_elms.$tags?.filter(c => c.$name == 'loc')[0].$text ?? ''
        const authors = url_elms.$tags?.filter(c => c.$name == 'authors')[0].$text ?? ''

        htmls.push(html`
            <li>
                <a href="${loc}">${loc.replace('https://mrrrp.cat', '')}</a>
                <span>${authors}</span>
            </li>
        `)
    }

    r.return(200, html`<ul>${htmls}</ul>`.toString())
}

export default { render }
