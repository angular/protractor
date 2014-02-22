var path = require('canonical-path');
var nunjucks = require('nunjucks');
var fs = require('fs');

var templateFile;

module.exports = {
  name: 'proper-render',
  description: 'Do the rendering',
  runAfter: ['rendering-docs'],
  runBefore: ['docs-rendered'],
  init: function() {
    var apiTemplate = path.resolve(__dirname, '../api-template.md');
    templateFile = fs.readFileSync(apiTemplate, 'utf-8');
  },
  process: function(docs) {
    docs.forEach(function(doc) {
      doc.renderedContent = nunjucks.renderString(templateFile, doc);
    });
  }
};
