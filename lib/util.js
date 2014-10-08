var q = require('q'),
    path = require('path');

/**
 * Internal helper for abstraction of polymorphic filenameOrFn properties.
 * @param {object} filenameOrFn The filename or function that we will execute.
 * @param {Array.<object>}} args The args to pass into filenameOrFn.
 * @return {q.Promise} A promise that will resolve when filenameOrFn completes.
 */
exports.runFilenameOrFn_ = function(configDir, filenameOrFn, args) {
  var returned = null;
  if (filenameOrFn) {
    if (typeof filenameOrFn === 'function') {
      returned = filenameOrFn.apply(null, args);
    } else if (typeof filenameOrFn === 'string') {
      filenameOrFn = require(path.resolve(configDir, filenameOrFn));
      if (typeof filenameOrFn === 'function') {
        returned = filenameOrFn.apply(null, args);
      }
    } else {
      throw 'filenameOrFn must be a string or function';
    }
  }
  return q(returned);
};
