var _ = require('lodash');

module.exports = {
  name: 'add-toc',
  description: 'Add table of contents',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    var byFile = _.groupBy(docs, 'fileName');

    var toc = [];

    // https://github.com/andresdominguez/protractor/blob/documentationMerge/docs/protractor.md#element

    var addLink = function(doc) {
      // Remove the dots.
      var linkName = doc.name.replace(/\./g, '');
      toc.push({
        name: doc.name,
        link: linkName
      });
    };

    _.each(byFile, function(docs, fileName) {
      // This is the file header
      toc.push({
        name: fileName,
        isHeader: true
      });
      _.each(docs, addLink);
    });

    // Add the table of contents at the beginning.
    docs.unshift({
      outputPath: 'partials/toc.md',
      isToc: true,
      toc: toc
    });
  }
};
