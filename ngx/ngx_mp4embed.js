// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
// https://github.com/sandersn/manual/blob/master/Strict-JSDoc.md
/// <reference path="vendor/njs.d.ts" />
/*
- /mp4embed/https://mrrrp.cat/media/AND_LIFE_原口沙輔_ensemble_set.mp4
*/
import { html } from './vendor/html.js'

/** @param {NginxHTTPRequest} r */
function embed(r) {
    const raw = /** @type {string} */ (r.variables.request_uri)

    // NOTE(liam): we must use "r.variables.request_uri" instead of "r.uri" because nginx
    //             normalises slashes "//" -> "/" and we want to be able to dump a huge link
    //             after the /mp4embed/.
    //
    //             the "merge_slashes off;" will not help us here because it cannot be applied
    //             at the location level. this is fine for us!

    if (!raw.startsWith('/mp4embed/')) {
        return r.return(404)
    }
    const tr = raw.slice('/mp4embed/'.length)

    // extract the extension, if it exists maybe
    const m = /[^/\\.]\.([^/\\.]+)$/.exec(tr);
    const ext = m ? m[1].toLowerCase() : '';

    let mimes
    if (VIDEO_TYPES[ext]) {
        mimes = html`
            <meta property="og:video:type" content="${VIDEO_TYPES[ext]}">
            <meta name="twitter:player:stream:content_type" content="${VIDEO_TYPES[ext]}">
        `   
    }
    
    const h = html`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${tr}</title>
            <meta property="og:type" content="website">
            <meta property="og:locale" content="en_AU">

            <meta property="og:video" content="${tr}">
            <meta name="twitter:card" content="player">
            <meta name="twitter:player:stream" content="${tr}">
            ${mimes}

            <meta http-equiv="refresh" content="0; url=${tr}">
        </head>
        <body>
            <h1>${tr}</h1>
        </body>
        </html>
    `

    r.headersOut['Content-Type'] = 'text/html'
    r.return(200, h.toString())
}

export default { embed }

/** @type {Record<string, string | undefined>} */
const VIDEO_TYPES = {
    mp4:  'video/mp4',
    m4v:  'video/x-m4v',
    mov:  'video/quicktime',
    qt:   'video/quicktime',
    webm: 'video/webm',
    mkv:  'video/x-matroska',
    avi:  'video/x-msvideo',
    wmv:  'video/x-ms-wmv',
    asf:  'video/x-ms-asf',
    asx:  'video/x-ms-asf',
    flv:  'video/x-flv',
    f4v:  'video/x-f4v',
    ogv:  'video/ogg',
    '3gp':  'video/3gpp',
    '3g2':  'video/3gpp2',
    mpeg: 'video/mpeg',
    mpg:  'video/mpeg',
    m1v:  'video/mpeg',
    m2v:  'video/mpeg',
    ts:   'video/mp2t',
    m2ts: 'video/mp2t',
    mts:  'video/mp2t',
    vob:  'video/mpeg',
    divx: 'video/divx',
    m3u8: 'application/vnd.apple.mpegurl',
    mpd:  'application/dash+xml',
}
