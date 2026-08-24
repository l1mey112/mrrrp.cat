// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
/// <reference path="vendor/njs.d.ts" />

/** @param {NginxHTTPRequest} r */
function wrnext(r) {
    // TODO
    r.return(302, '/');
}

/** @param {NginxHTTPRequest} r */
function wrprev(r) {
    // TODO
    r.return(302, '/');
}

export default { wrnext, wrprev };
