var _ = require('lodash');

var escapeHtml = function(htmlCode) {
  return htmlCode.
      replace(/&/g, '&amp;').
      replace(/"/g, '&quot;').
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;');
};

/**
 * Add table of contents.
 */
module.exports = function addToc() {
  return {
    $runAfter: ['extracting-tags'],
    $runBefore: ['tags-extracted'],
    $process: function(docs) {
      // Get the properties that will be copied to the table of contents.
      var toc = _.map(docs, function(doc) {
        if (doc.view) {
          doc.htmlView = escapeHtml(doc.view);
        }

        return _.pick(doc,
            'alias',
            'description',
            'example',
            'extends',
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

      // Replace all the docs with the table of contents.
      docs.length = 0;
      docs.push({
        id: 'x',
        docType: 'js',
        outputPath: 'toc.json',
        template: 'toc',
        toc: toc,
        version: require('../../../package.json').version
      });
    }
  };
};
