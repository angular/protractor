var _ = require('lodash');

/**
 * Remove docs of private variables from selenium's promise.js file.
 *
 * @param {Array.<Object>} docs The jsdoc list.
 */
var filter = function(docs) {
  return _.reject(docs, function(doc) {
    return doc.fileName == "promise" && doc.name &&
        doc.name.substr(0,7) != "promise";
  });
};

/**
 * Filter functions that will not go into the documentation.
 */
module.exports = function filterPromise() {
  return {
    $runAfter: ['extracting-tags'],
    $runBefore: ['tags-extracted'],
    $process: filter
  };
};
