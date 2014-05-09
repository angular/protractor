var _ = require('lodash');

module.exports = {
  name: 'add-toc',
  description: 'Add table of contents',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    // Group docs by file name.
    var byFile = _.groupBy(docs, 'fileName'),
        toc = [];

    _.each(byFile, function(docs, fileName) {
      // This is the file header
      toc.push({
        name: fileName,
        isHeader: true
      });

      docs.forEach(function(doc) {
        var name = doc.name || '';
        toc.push({
          name: name
        });
      });
    });

    // Get the version.
    // Add the table of contents.
    docs.push({
      outputPath: 'toc.md',
      template: 'toc',
      toc: toc,
      version: require('../../package.json').version
    });
  }
};
