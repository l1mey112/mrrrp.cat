// https://nginx.org/en/docs/njs
// https://github.com/nginx/njs-examples
// https://github.com/sandersn/manual/blob/master/Strict-JSDoc.md
/// <reference path="../vendor/njs.d.ts" />
import { html, Raw } from '../vendor/html.js'
import { decodeSnowcode, encodeSnowcode } from '../vendor/snowcode.js'

/*

NOTE(liam):
ive basically documented how a special embed is done over Discord in README.md

to be brief, there are three different distinct rendering modes that Discord uses
   (opengraph)
   (opengraph + oembed)
   (opengraph + mastodon compatible)

let's use opengraph + mastodon compatible for this embed test

    /users/:handle/statuses/:id
           ^^^^^^^           |
           cosmetic          |  discord will splat this id onto the end of this
                             |
    /api/v1/statuses/:id <---/
*/

const authorText = `hello`
const authorName = `your name`

// /post/123123
// ->  <link href="https://mrrrp.cat/users/UltimateMrrrp/statuses/123123" ...>
//
// /api/v1/statuses/123123
// -> return json

/*
<!--# include virtual="/index_meta_embed" -->
*/
// /index_meta_embed
/** @param {NginxHTTPRequest} r */
function post_123123(r) {

    const is_discord = (r.headersIn['User-Agent'] || '').includes('Discordbot')
    // false : opengraph
    // true  : opengraph - og:image + activitypub faking
    
    const h = html`
        <link rel="canonical" href="https://mrrrp.cat/">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://mrrrp.cat/">
        <meta property="og:site_name" content="mrrrp.cat">
        <meta property="og:locale" content="en_AU">

        ${!is_discord ? html`
            <meta property="og:image" content="https://mrrrp.cat/media/happy-cat.gif">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:image" content="https://mrrrp.cat/media/happy-cat.gif">` : ''}

        <meta property="twitter:title" content="mrrrp.cat's awesome website">
        <meta property="og:title" content="mrrrp.cat's awesome website">
        <meta property="og:description" content="mrrrrrrrrrrrrpppp">
        <meta property="theme-color" content="#edc6b5"/>

        ${is_discord ? html`
            <link href="https://mrrrp.cat/users/UltimateMrrrp/statuses/123123"
                rel="alternate" type="application/activity+json">` : ''}
    `

    r.headersOut['Content-Type'] = 'text/html'
    r.return(200, h.toString())
}

/*
NOTE(liam): if you ever want to add some metadata, try

<script type="application/activity+json">
    ${new Raw(JSON.stringify(o2))}
</script>
*/

// /api/v1/statuses/123123
/** @param {NginxHTTPRequest} r */
function post_123123_status(r) {
    // <b>  <i>  <code>  <pre>  <a href="...">  <blockquote>  <br>
    const post_content =
`<b>b</b> <strong>strong</strong> <i>i</i> <em>em</em> <s>s</s> <u>u</u><br><br><code>code</code><br><pre>pre</pre><br><a href="https://example.com">a</a><br><br><blockquote>blockquote</blockquote><br><h1>h1</h1> <p>p</p> <ul><li>li</li></ul><br><span style="color:red">span+css</span><br>&amp;lt; entity &amp;gt;

<br><br>

▁▂▃▄▅▆▇█ <:hapcat3:1542789996443074570>`
    
    const o = {
        "id": "123123",
        "url": "https://mrrrp.cat/",
        "uri": "https://mrrrp.cat/",
        "created_at": "2026-08-24T00:28:43.000Z",
        "edited_at": null,
        "reblog": null,
        "in_reply_to_id": null,
        "in_reply_to_account_id": null,
        "language": "en",
        "content": post_content,
        "spoiler_text": "",
        "visibility": "public",
        "application": {
            "name": "Twitter for iPhone",
            "website": null
        },
        "media_attachments": [
            {
                "id": "999999999999",
                "type": "image",
                "url": "https://mrrrp.cat/media/frontpage!.png",
                "preview_url": null,
                "remote_url": null,
                "preview_remote_url": null,
                "text_url": null,
                "description": null,
                "meta": {
                    "original": {
                        "width": 1149,
                        "height": 838,
                        "size": "1149x838",
                        "aspect": 1.3711217183770883
                    }
                }
            }
        ],
        "account": {
            "id": "123123",
            "display_name": "Mrrrp.cat test",
            "username": "UltimateMrrrp",
            "acct": "UltimateMrrrp",
            "url": "https://mrrrp.cat/",
            "uri": "https://mrrrp.cat/",
            "created_at": "2026-08-24T00:28:43.000Z",
            "locked": false,
            "bot": false,
            "discoverable": true,
            "indexable": false,
            "group": false,
            "avatar": "https://mrrrp.cat/media/favicon-96x96.png",
            "avatar_static": "https://mrrrp.cat/media/favicon-96x96.png",
            "header": "https://pbs.twimg.com/profile_banners/76348185/1784126031",
            "header_static": "https://pbs.twimg.com/profile_banners/76348185/1784126031",
            "followers_count": 9999999,
            "following_count": 9999999,
            "statuses_count": 9999999,
            "hide_collections": false,
            "noindex": false,
            "emojis": [],
            "roles": [],
            "fields": []
        },
        "mentions": [],
        "tags": [],
        "emojis": [],
        "card": null,
        "poll": null
    }

    r.headersOut['Content-Type'] = 'application/json'
    r.return(200, JSON.stringify(o))
}

export default { post_123123, post_123123_status }
