var nunjucks = require('nunjucks');
var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var basePackage = require('dgeni-packages/jsdoc');

var skipFiles = ['cli', 'runner'];

var tagFilter = {
  name: 'do-stuff',
  description: 'Doing some stuff',
  runAfter: ['extracting-tags'],
  init: function (config) {

  },
  process: function (docs) {
    var i = 1;
    docs.forEach(function (doc) {
      var regExp = /([^@]*)(@.*)?/;

      doc.desc = regExp.exec(doc.content || '')[1];
      doc.outputPath = 'partials/' + doc.fileName + (i++) + '.md'
    });
  }
};

var properRender = {
  name: 'proper-render',
  description: 'Do the rendering',
  runAfter: ['rendering-docs'],
  runBefore: ['docs-rendered'],
  process: function (docs) {
    docs.forEach(function (doc) {
      console.log(doc);

      doc.renderedContent =
          nunjucks.renderString(doc.renderedContent, doc);
    });
  }
};


module.exports = function (config) {

  config = basePackage(config);

  config.append('processing.processors', [tagFilter, properRender]);

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
