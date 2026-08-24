.PHONY: serve deps
serve:
	@echo http://localhost:8080
	# TODO: run local server.js too and use njs
	air

.PHONY: update_repology_data
update_repology_data:
	ruby build/update_repology_data.rb
