NJS := $(shell for p in \
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
	@[ -n "$(NJS)" ] || { echo "ngx_http_js_module.so not found"; exit 1; }
	nginx -p $(CURDIR)/.ngx -c nginx.conf -e /dev/stdout -g 'load_module $(NJS); daemon off;'

update_repology_data:
	ruby vendor/update_repology_data.rb
