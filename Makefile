PREFIX := $(CURDIR)
NJS := $(shell for p in \
	/etc/nginx/modules/ngx_http_js_module.so \
	/usr/lib/nginx/modules/ngx_http_js_module.so \
	/usr/lib64/nginx/modules/ngx_http_js_module.so \
	$$(command -v brew >/dev/null 2>&1 && echo "$$(brew --prefix)/lib/nginx/modules/ngx_http_js_module.so") \
	/opt/homebrew/lib/nginx/modules/ngx_http_js_module.so \
	/usr/local/lib/nginx/modules/ngx_http_js_module.so; do \
	[ -f "$$p" ] && { echo "$$p"; break; }; done)

.PHONY: web update_repology_data

# to get njs
# debian: libnginx-mod-http-js
# arch: nginx-mod-njs

web:
	@mkdir -p data logs
	@[ -n "$(NJS)" ] || { echo "ngx_http_js_module.so not found"; exit 1; }
	nginx -p $(PREFIX) -c nginx.conf -g 'load_module $(NJS); working_directory $(PREFIX); daemon off;'

update_repology_data:
	ruby build/update_repology_data.rb
