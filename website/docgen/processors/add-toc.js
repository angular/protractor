var _ = require('lodash');

var escapeHtml = function(htmlCode) {
  return htmlCode.
      replace(/&/g, '&amp;').
      replace(/"/g, '&quot;').
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;');
};

module.exports = {
  name: 'add-toc',
  description: 'Add table of contents',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    // Get the properties that will be copied to the table of contents.
    var toc = _.map(docs, function(doc) {
      if (doc.view) {
        doc.htmlView = escapeHtml(doc.view);
      }

      return _.pick(doc,
          'alias',
          'description',
          'example',
          'fileName',
          'htmlView',
          'name',
          'params',
          'returns',
          'returnString',
          'sourceLink',
          'view'
      );
    });

    // Add the table of contents.
    docs.push({
      outputPath: 'toc.json',
      template: 'toc',
      toc: toc,
      version: require('../../../package.json').version
    });
  }
};
