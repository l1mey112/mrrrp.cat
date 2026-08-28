[<- Go back](https://mrrrp.cat/)

# if you are invited here, write whatever you want!

TODO: documentation
TODO: directory map
TODO: make more palatable, more maintainable, and more approachable for all 

anyone can write anything on it

and it will  show up on https://mrrrp.cat/

put mp3s on ther
and cat picture

no asking for permission

## For adding node modules:

https://nginx.org/en/docs/njs/node_modules.html

# the mrrrp.cat webring!

if you have a website and we like you, try [https://mrrrp.cat/ring/example.com/invite](https://mrrrp.cat/ring/example.com/invite) with your domain name for instructions!

![the mrrrp.cat webring](/media/webring_preview.png)

# Prod

- The way production is done is super simple. It's made to be exactly like the development environment.
- The "box" just does `make`. Everything is persisted and it's ran from the repo root. Use `data/` to dump stuff and nginx is configured to dump into `logs/`

```
data/
logs/
```

