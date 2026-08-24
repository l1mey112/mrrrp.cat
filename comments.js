import fs from 'fs';

// TODO: lol this should be a database
const commentsFile = './mrrrp-comments.json';

function readComments() {
    try {
        return JSON.parse(
            fs.readFileSync(commentsFile, 'utf8')
        );
    } catch {
        return [];
    }
}

function writeComments(comments) {
    fs.writeFileSync(
        commentsFile,
        JSON.stringify(comments, null, 2)
    );
}

function comments(r) {
    const savedComments = readComments();

    if (r.method === 'GET') {
        r.headersOut['Content-Type'] = 'application/json';
        r.return(200, JSON.stringify(savedComments));
        return;
    }

    if (r.method !== 'POST') {
        r.return(405, 'Method not allowed');
        return;
    }

    try {
        const data = JSON.parse(r.requestBody || '{}');
        const text = String(data.text || '').trim();

        if (!text || text.length > 500) {
            r.return(400, 'Invalid comment');
            return;
        }

        const comment = {
            id: Date.now(),
            text: text,
            x: Number(data.x) || 0,
            y: Number(data.y) || 0,
            rotation: Number(data.rotation) || 0
        };

        savedComments.push(comment);
        writeComments(savedComments);

        r.headersOut['Content-Type'] = 'application/json';
        r.return(200, JSON.stringify(comment));
    } catch {
        r.return(400, 'Invalid request');
    }
}

export default { comments }
