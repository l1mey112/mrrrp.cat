// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
// https://github.com/sandersn/manual/blob/master/Strict-JSDoc.md
/// <reference path="vendor/njs.d.ts" />

import fs from 'fs'
import { marked } from './vendor/marked.esm.js'

/** @param {NginxHTTPRequest} r */
function mark(r) {
    // $uri, $uri.md, $uri/index.md
    const root = r.variables.document_root

    for (const k of [r.uri, r.uri + '.md', r.uri + '/index.md']) {
        try {
            // NOTE: a pretty important distinction, the "$uri" is post normalisation of the path
            //       so just appending non path things without ".." doesn't do path traversal
            //
            //       watch out if you're reading from the filesystem form r.args["q"] etc
            const out = fs.readFileSync(root + k, 'utf8')

            //r.headersOut['Content-Type'] no need to set, we use default_type
            r.return(200, marked.parse(out))
            return
        } catch (e) {
            continue
        }
    }
    r.return(404)
}

export default { mark }
