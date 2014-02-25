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

      // Add the link to jump to the jsdoc definition in api.md.
      _.each(docs, function(doc) {
        // Remove the dots.
        var name = doc.name || '';

        // The link looks like: 'elementFinder.isPresent' into
        // 'elementfinderispresent'.
        var linkName = name.replace(/[\.\$]/g, '').toLocaleLowerCase();

        toc.push({
          name: name,
          link: linkName
        });
      });
    });

    // Add the table of contents at the beginning.
    docs.unshift({
      outputPath: 'toc.md',
      isToc: true,
      toc: toc
    });
  }
};
