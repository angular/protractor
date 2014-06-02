var util = require('util');

/**
 * A debug framework which does not actually run any tests, just spits
 * out the list that would be run.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @param done A callback for when tests are finished.
 */
exports.run = function(runner, specs, done) {
  console.log('Resolved spec files: ' + util.inspect(specs));
  done({
    failedCount: 0
  });
};
