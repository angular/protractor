var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var basePackage = require('dgeni-packages/jsdoc');

module.exports = function (config) {

  config = basePackage(config);

  // Override the default extractor.
  config.set('source.extractors', [
    require('./processors/js')
  ]);

  config.append('processing.processors', [
    require('./processors/tag-fixer'),
    require('./processors/doc-renderer')
  ]);

  // The name tag should not be required.
  var tagDefs = require('dgeni-packages/jsdoc/tag-defs');
  var nameTag = _.find(tagDefs, {name: 'name'});
  nameTag.required = false;

  config.append('processing.tagDefinitions', tagDefs);

  var basePath = path.resolve(packagePath, '..');

  config.set('source.files', [
    { pattern: 'lib/**/protractor.js', basePath: basePath },
    { pattern: 'node_modules/selenium-webdriver/lib/webdriver/webdriver.js', basePath: basePath }
  ]);

  config.set('rendering.outputFolder', 'build');
  config.set('logging.level', 'debug');

  var docsPath = path.resolve(basePath, 'docs');
  config.set('rendering.templateFolders', [docsPath]);

  config.set('rendering.templatePatterns', [
    'api-template.md'
  ]);

  return config;
};
