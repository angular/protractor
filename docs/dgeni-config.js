var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;
var basePackage = require('dgeni-packages/jsdoc');

module.exports = function(config) {

  config = basePackage(config);

  // Override the default extractor with a custom processor that reads the next
  // line of code after the closing jsdoc.
  config.set('source.extractors', [
    require('./processors/js')
  ]);

  /*
   * Add a couple of processors to the pipe to do extra parsing and rendering.
   *
   * tag-fixer: Get the name of the function, format the @param and @return
   *     annotations to prepare them for rendering and generate an output file
   *     name using a sequence.
   *
   */
  config.append('processing.processors', [
    require('./processors/tag-fixer'),
    require('./processors/filter-jsdoc'),
    require('./processors/doc-renderer'),
    require('./processors/add-links'),
    require('./processors/add-toc')
  ]);

  // The name tag should not be required.
  var tagDefs = require('dgeni-packages/jsdoc/tag-defs');
  tagDefs.push({name: 'alias'});
  tagDefs.push({name: 'example'});
  tagDefs.push({name: 'view'});
  var nameTag = _.find(tagDefs, {name: 'name'});
  nameTag.required = false;

  config.append('processing.tagDefinitions', tagDefs);

  var basePath = path.resolve(packagePath, '..');

  config.set('source.files', [
    {pattern: 'lib/**/protractor.js', basePath: basePath},
    {pattern: 'lib/**/locators.js', basePath: basePath},
    {pattern: 'node_modules/selenium-webdriver/lib/webdriver/webdriver.js',
      basePath: basePath}
  ]);

  config.set('rendering.outputFolder', 'build');
  config.set('logging.level', 'debug');

  var docsPath = path.resolve(basePath, 'docs');
  config.set('rendering.templateFolders', [docsPath]);

  config.set('rendering.templatePatterns', [
    'templates/api-template.md'
  ]);

  return config;
};
