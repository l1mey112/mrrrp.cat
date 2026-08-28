// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
// https://github.com/sandersn/manual/blob/master/Strict-JSDoc.md
/// <reference path="vendor/njs.d.ts" />

import fs from 'fs';

// NOTE: readFileSync performs a plain open() and reads from the startup cwd (no ngx config)
const commentsFile = 'data/comments.json';

/**
 * @param {NginxHTTPRequest} r
 */
async function readComments(r) {
    try {
        const contents = await fs.promises.readFile(commentsFile, 'utf8');

        if (!contents.trim()) {
            return [];
        }

        const comments = JSON.parse(contents);
        return Array.isArray(comments) ? comments : [];
    } catch (e) {
        r.error(`readComments: ${e}`);
        return [];
    }
}

/**
 * @param {NginxHTTPRequest} r
 * @param {object[]} comments
 */
async function writeComments(r, comments) {
    try {
        await fs.promises.writeFile(
            commentsFile,
            JSON.stringify(comments, null, 2),
        );

        return true;
    } catch (e) {
        r.error(`writeComments: ${e}`);
        return false;
    }
}

/** @param {NginxHTTPRequest} r */
async function comments(r) {
    if (r.method !== 'GET' && r.method !== 'POST') {
        r.return(405, 'Method not allowed');
        return;
    }

    if (r.method === 'GET') {
        const savedComments = await readComments(r);

        r.headersOut['Content-Type'] = 'application/json';
        r.return(200, JSON.stringify(savedComments));
        return;
    }

    try {
        const data = JSON.parse(r.requestText || '{}');
        const text = String(data.text || '').trim();

        if (!text || text.length > 500) {
            r.return(400, 'Invalid comment');
            return;
        }

        const savedComments = await readComments(r);

        const comment = {
            id: Date.now(),
            text,
            x: Number(data.x) || 0,
            y: Number(data.y) || 0,
            rotation: Number(data.rotation) || 0
        };

        savedComments.push(comment);

        const written = await writeComments(r, savedComments);

        if (!written) {
            r.return(500, 'Could not save comment');
            return;
        }

        r.headersOut['Content-Type'] = 'application/json';
        r.return(200, JSON.stringify(comment));
    } catch (e) {
        r.error(`comments: ${e}`);
        r.return(400, 'Invalid request');
    }
}

export default { comments };
