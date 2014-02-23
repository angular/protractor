var path = require('canonical-path');
var nunjucks = require('nunjucks');
var fs = require('fs');

var apiTemplate,
    tocTemplate;

module.exports = {
  name: 'proper-render',
  description: 'Do the rendering',
  runAfter: ['rendering-docs'],
  runBefore: ['docs-rendered'],
  init: function() {
    function readFile(filePath) {
      return fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
    }

    apiTemplate = readFile('../api-template.md');
    tocTemplate = readFile('../toc-template.md');
  },
  process: function(docs) {
    docs.forEach(function(doc) {
      // Choose the template: table of contents or function.
      var template = doc.isToc ? tocTemplate : apiTemplate;
      doc.renderedContent = nunjucks.renderString(template, doc);
    });
  }
};
