/*
this is a cool library that basically does html santisiation for you.
by doing the following

    h = html`
        <li>
            <a href="${loc}">${loc.replace('https://mrrrp.cat', '')}</a>
            <span>${authors}</span>
        </li>
    `

each of the template specifiers in ${...} will be santised by the function
and the output is a Raw value which can be toString()ed at the end to get
the html

    r.return(200, html`<ul>${h}</ul>`.toString())


##### NEW ###################################

also supports returning markdown with

    m = md`
        # hello!!

        <p>also works with html!<\p>
    `
*/

import { marked } from './marked.esm.js'

export class Raw {
    /** @param {string} s  */
    constructor(s) { this.s = s; }
    toString() { return this.s; }
}

/**
 * @param {TemplateStringsArray} strings
 * @param {...(Raw|string|number|boolean|null|undefined|readonly (Raw|string|number)[])} vals
 * @returns {Raw}
 */
export function html(strings, ...vals) {

    /**
     * @param {any} s 
     */
    const escape = s => String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    
    let out = strings[0];
    for (let i = 0; i < vals.length; i++) {
        const v = vals[i];
        out += (Array.isArray(v) ? v.map(x => x instanceof Raw ? x.s : escape(x)).join('')
             : v instanceof Raw ? v.s
             : v == null ? ''
             : escape(v));
        out += strings[i + 1];
    }
    return new Raw(out);
}

/**
 * @param {TemplateStringsArray} strings
 * @param {...(Raw|string|number|boolean|null|undefined|readonly (Raw|string|number)[])} vals
 * @returns {Raw}
 */
export function md(strings, ...vals) {
    return new Raw(marked.parse(html(strings, ...vals).toString()))
}
