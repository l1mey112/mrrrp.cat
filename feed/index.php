<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>feed</title>
    <link rel="icon" href="/media/favicon.ico" sizes="32x32">
</head>

<body>
    <h1 style="font-size: 150px">under construction</h1>

    <script>
        const fonts = [
            '"Comic Sans MS", cursive',
            '"Times New Roman", serif',
            'Georgia, serif',
            '"Courier New", monospace',
            'Impact, fantasy',
            '"Arial Black", sans-serif',
            'Verdana, sans-serif',
            'Papyrus, fantasy',
            '"Brush Script MT", cursive',
            '"Lucida Console", monospace',
        ];

        const h1 = document.querySelector('h1');
        // console.log(...h1.textContent[0])
        const chars = [...h1.textContent].map((ch, i) => {
            const s = document.createElement('span');
            s.textContent = ch === ' ' ? ' ' : ch;
            s.period = 5 + (i * 3) % 13;
            s.phase = (i * 7) % 11;
            s.font = i % fonts.length;
            s.style.fontFamily = fonts[s.font];
            return s;
        });
        h1.replaceChildren(...chars);
        let t = 0;
        setInterval(() => {
            t++;
            chars.forEach((c, i) => {
                if ((t + c.phase) % c.period === 0) {
                    c.font = (c.font + 1) % fonts.length;
                    c.style.fontFamily = fonts[c.font];
                }
                // lol
                const y = Math.sin((t + i * 9) / 14) * 8;
                const rot = Math.sin((t + i * 13) / 21) * 10;
                const scale = 1 + Math.sin((t + i * 5) / 11) * 0.15;
                c.style.transform = `translateY(${y}px) rotate(${rot}deg) scale(${scale})`;
            });
        }, 30);
    </script>
</body>

</html>
