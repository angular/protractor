var _ = require('lodash');

/**
 * Exclude the following tags.
 * @const {Array.<string>}
 */
var excludedTags = ['private', 'type'];

/**
 * Remove docs that should not be in the documentation.
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
      var tags = _.pluck(doc.tags.tags, 'title');
      return _.intersection(tags, excludedTags).length;
    }
  });
};

module.exports = {
  name: 'filter-jsdoc',
  description: 'Filter ',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    return filterDocs(docs);
  }
};
