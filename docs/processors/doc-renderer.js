var nunjucks = require('nunjucks');
var fs = require('fs');

var templateFile;

module.exports = {
  name: 'proper-render',
  description: 'Do the rendering',
  runAfter: ['rendering-docs'],
  runBefore: ['docs-rendered'],
  init: function () {
    templateFile = fs.readFileSync('/Users/andresdom/dev/protractor/docs/api-template.md', 'utf-8');
  },
  process: function (docs) {
    docs.forEach(function (doc) {
//      nunjucks.configure({autoescape: true});
      doc.renderedContent = nunjucks.renderString(templateFile, doc);
    });
  }
};
