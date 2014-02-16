var nunjucks = require('nunjucks');
var fs = require('fs');
var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var basePackage = require('dgeni-packages/jsdoc');

var tagFilter = {
  name: 'do-stuff',
  description: 'Doing some stuff',
  runAfter: ['extracting-tags'],
  init: function (config) {
  },
  process: function (docs) {
    var i = 1;
    docs.forEach(function (doc) {
      // Clean the tags.
      if (doc.tags) {
        doc.tags.tags.forEach(function (tag) {
          tag.description = (tag.description || '').replace('\n', ' ');
        })
      }

      // Get everything until the first @.
      doc.desc = /[^@]*/.exec(doc.content || '')[0];
      doc.outputPath = 'partials/' + doc.fileName + (i++) + '.md'
    });
  }
};

var templateFile = fs.readFileSync('/Users/andresdom/dev/protractor/docs/api-template.md', 'utf-8');

var properRender = {
  name: 'proper-render',
  description: 'Do the rendering',
  runAfter: ['rendering-docs'],
  runBefore: ['docs-rendered'],
  process: function (docs) {
    docs.forEach(function (doc) {
      console.log(doc);
      nunjucks.configure({autoescape: true});
      doc.renderedContent = nunjucks.renderString(templateFile, doc);
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
