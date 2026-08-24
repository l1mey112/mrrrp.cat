require 'fileutils'
require 'json'
require 'yaml'

system('git clone --depth 1 https://github.com/repology/repology-updater')

raw_recipe_links = {}
Dir.glob('repology-updater/repos.d/**/*.yaml').each do |repo|
  # Repology's repository files use jinja templating.
  # There is no Ruby implementation of jinja, nor are there Ruby bindings to any implementations.
  # I have no particular interest in creating any, so I'm using the cli.
  parsed_repos = YAML.safe_load(`jinja2 #{repo}`, permitted_classes: [Date])

  # Get the name of each repository and its template for raw package recipes.
  parsed_repos.each do |parsed_repo|
    raw_recipe_links[parsed_repo['name']] = parsed_repo['packagelinks']&.find { _1['type'] == 'PACKAGE_RECIPE_RAW'}&.fetch('url')
  end

end

File.write('vendor/repology_data.json', JSON.pretty_generate(raw_recipe_links))

FileUtils.rm_rf('repology-updater')
