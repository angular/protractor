var _ = require('lodash');
var path = require('path');
var packagePath = __dirname;
var basePackage = require('dgeni-packages/jsdoc');

module.exports = function(config) {

  config = basePackage(config);

  // Use the jsdoc extractor instead of the default to parse the function name.
  config.set('source.extractors', [
    require('dgeni-packages/jsdoc/extractors/jsdoc.js')
  ]);

  /*
   * Add a couple of processors to the pipe to do extra parsing and rendering.
   *
   * tag-fixer: Get the name of the function, format the @param and @return
   *     annotations to prepare them for rendering.
   * filter-jsdoc: Filter the functions that will not be part of the output
   *     documentation and generate a unique name for the output partial file.
   * set-file-name: Add a file name that can be sorted alphabetically.
   * add-links: Add links to the source code for protractor.js, locators.js,
   *     and webdriver.js.
   * add-toc: Add the table of contents.
   */
  config.append('processing.processors', [
    require('./processors/tag-fixer'),
    require('./processors/filter-jsdoc'),
    require('./processors/set-file-name'),
    require('./processors/add-links'),
    require('./processors/add-toc')
  ]);

  /*
   * Add custom filters.
   */
  config.append('rendering.filters', [
    require('./filters/link-slugify')
  ]);

  // Configure the tags that will be parsed from the jsDoc.
  var tagDefs = require('dgeni-packages/jsdoc/tag-defs');

  // Parse the following annotations.
  tagDefs.push({name: 'alias'});
  tagDefs.push({name: 'augments'});
  tagDefs.push({name: 'deprecated'});
  tagDefs.push({name: 'example'});
  tagDefs.push({name: 'extends'});
  tagDefs.push({name: 'private'});
  tagDefs.push({name: 'see'});
  tagDefs.push({name: 'type'});
  tagDefs.push({name: 'view'});

  // The name tag should not be required.
  var nameTag = _.find(tagDefs, {name: 'name'});
  nameTag.required = false;

  config.set('processing.tagDefinitions', tagDefs);

  // OutputPath for docs that do not already have them.
  config.set('rendering.contentsFolder',
      path.resolve(config.basePath, 'build'));

  // Base path is the protractor root dir.
  var basePath = path.resolve(packagePath, '../..');

  // Generate documentation for protractor, locators, and webdriver.
  config.set('source.files', [
    {pattern: 'lib/**/protractor.js', basePath: basePath},
    {pattern: 'lib/**/locators.js', basePath: basePath},
    {pattern: 'node_modules/selenium-webdriver/lib/webdriver/webdriver.js',
      basePath: basePath}
  ]);

  // TODO(andres): Add ability to link to previous versions.
  config.set('linksHash', 'master');
  config.set('source.projectPath', basePath);
  config.set('rendering.outputFolder', 'build');
  config.set('logging.level', 'debug');

  var docsPath = path.resolve('docgen/templates');
  config.set('rendering.templateFolders', [docsPath]);

  config.set('rendering.templatePatterns', [
    '${ doc.template }-template.txt'
  ]);

  return config;
};
