.PHONY: serve
serve:
	@echo http://localhost:8080
	air

.PHONY: update_repology_data
update_repology_data:
	ruby build/update_repology_data.rb
