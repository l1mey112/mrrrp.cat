OS   := $(shell uname -s | tr A-Z a-z)
ARCH := $(shell uname -m)
VER  := $(shell nginx -v 2>&1 | sed -n 's|.*nginx/\([0-9.]*\).*|\1|p')
#LIBC := $(shell [ -e /lib/ld-musl-$(ARCH).so.1 ] && echo musl || echo gnu)

NJS := $(shell for p in \
	$(CURDIR)/ngx/vendor/modules/linux-$(ARCH)-gnu-$(VER).so \
	/etc/nginx/modules/ngx_http_js_module.so \
	/usr/lib/nginx/modules/ngx_http_js_module.so \
	/usr/lib64/nginx/modules/ngx_http_js_module.so \
	$$(command -v brew >/dev/null 2>&1 && echo "$$(brew --prefix)/lib/nginx/modules/ngx_http_js_module.so") \
	/opt/homebrew/lib/nginx/modules/ngx_http_js_module.so \
	/usr/local/lib/nginx/modules/ngx_http_js_module.so; do \
	[ -f "$$p" ] && { echo "$$p"; break; }; done)

.PHONY: web update_repology_data

web:
	@mkdir -p data
	@[ -n "$(NJS)" ] || { printf 'no ngx_http_js_module.so for nginx %s\n' "$(VER)"; exit 1; }
	nginx -p $(CURDIR)/ngx -c nginx.conf -e /dev/stdout -g 'load_module $(NJS); daemon off;'

weblivereload:
	air

update_repology_data:
	ruby ngx/vendor/update_repology_data.rb
