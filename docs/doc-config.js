var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var basePackage = require('dgeni-packages/jsdoc');

module.exports = function (config) {

  config = basePackage(config);

  config.append('processing.processors', [
    {
      name: 'do-stuff',
      description: 'Doing some stuff',
      runAfter: ['rendering-docs'],
      runBefore: ['docs-rendered'],
      init: function (config) {
//        console.log(config);
      },
      process: function (docs) {
        var byFile = _.groupBy(docs, 'fileName');
        var keys = _.keys(byFile);
        console.log(keys);
        console.log(docs.length);
      }
    }
  ]);

  // The name tag should not be required.
  var tagDefs = require('dgeni-packages/jsdoc/tag-defs');
  var nameTag = _.find(tagDefs, {name: 'name'});
  nameTag.required = false;

  config.append('processing.tagDefinitions', tagDefs);

  var basePath = path.resolve(packagePath);
  basePath = '/Users/andresdom/dev/protractor';

  config.set('source.files', [
    { pattern: 'lib/**/*.js', basePath: basePath }
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
