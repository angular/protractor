var _ = require('lodash');

/**
 * Exclude the following tags.
 * @const {Array.<string>}
 */
var excludedTags = ['private', 'type'];

/**
 * Remove docs that should not be in the documentation. Reject type, private,
 * exported functions, and function ending with underscore.
 *
 * @param {Array.<Object>} docs The jsdoc list.
 */
var filterDocs = function(docs) {
  return _.reject(docs, function(doc) {
    // Skip functions starting with 'exports' and ending with _.
    if (!doc.name || /^exports/.test(doc.name) || /_\s*$/.test(doc.name)) {
      return true;
    }

    // Exclude docs with tags.
    if (doc.tags) {
      var tags = _.pluck(doc.tags.tags, 'tagName');
      return _.intersection(tags, excludedTags).length;
    }
  });
};

/**
 * Generate a unique file name with an index used to concatenate. The name has
 * the following format: 'protractor001.md'
 */
var fileName = function(doc) {
  counter += 1;

  // Generate a counter of 4 characters.
  var index = '000' + counter;
  index = index.substring(index.length - 4);
  return doc.fileName + index + '.md';
};

/**
 * Used to generate a sequence number for each function.
 * @type {number}
 */
var counter = 1;

module.exports = {
  name: 'filter-jsdoc',
  description: 'Filter functions that will not go into the documentation and ' +
      'generate a name for the output partial file that can be sorted ' +
      'alphabetically',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    docs = filterDocs(docs);

    // Generate the output file name.
    docs.forEach(function(doc) {
      doc.outputPath = fileName(doc);
    });

    return  docs;
  }
};
