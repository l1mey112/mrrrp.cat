const canvas = document.querySelector("#commentCanvas");

function addComment(data) {
    const comment = document.createElement("div");

    comment.className = "comment";
    comment.textContent = data.text;
    comment.style.left = `${data.x}px`;
    comment.style.top = `${data.y}px`;
    comment.style.setProperty(
        "--rotation",
        `${data.rotation}deg`
    );

    canvas.append(comment);
}

window.onload = () => {
    fetch("/comments")
        .then(response => response.json())
        .then(comments => {
            canvas.querySelector("a").remove()
            comments.forEach(addComment);
        }).catch(e => {
            a.innerText = "nvm the thingy is brokey " + e;
        });
}

canvas.onclick = e => {
    if(document.querySelector("#commentInput")) return;
    const input = document.createElement("div");

    input.id = "commentInput";
    input.style.left = `${e.offsetX}px`;
    input.style.top = `${e.offsetY}px`;

    input.innerHTML = `
                    <textarea rows="3" placeholder="ComMENt pls"></textarea>
                    <br>
                    <button id="post">Post</button>
                    <button id="close">Close</button>
                `;

    canvas.append(input);

    const textarea = input.querySelector("textarea");
    textarea.focus();

    input.querySelector("#close").onclick = event => {
        event.stopPropagation();
        input.remove();
    }

    post.onclick = event => {
        event.stopPropagation();

        const text = textarea.value.trim();

        if (!text) return;

        const data = {
            text: text,
            x: parseFloat(input.style.left),
            y: parseFloat(input.style.top),
            rotation: Math.random() * 8 - 4
        };

        fetch("/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Could not save comment");
                }

                return response.json();
            })
            .then(savedComment => {
                addComment(savedComment);
                input.remove();
            })
            .catch(error => {
                console.error(error);
                alert("The comment could not be saved.");
            });
    };
};
