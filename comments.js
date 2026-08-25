import fs from 'fs';

const commentsFile = '/tmp/mrrrp-comments.json';

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

async function writeComments(r, comments) {
    try {
        await fs.promises.writeFile(
            commentsFile,
            JSON.stringify(comments, null, 2),
            'utf8'
        );

        return true;
    } catch (e) {
        r.error(`writeComments: ${e}`);
        return false;
    }
}

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
