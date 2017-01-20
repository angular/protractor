/**
 * Setup afterEach hook for jasmine/mocha tests.
 *
 * One of the main purposes of this file is to give `__protractor_internal_afterEach_setup_spec.js`
 * a place to look up `runner.afterEach` at runtime without using globals.
 * This file needs to be separate from `__protractor_internal_afterEach_setup_spec.js` so that that
 * file is not prematurely executed.
 */

var path = require('path');

// Queried by `protractor_internal_afterEach_setup_spec.js` for the `afterEach` hook
var hooks = {
  afterEach: null
};

exports.hooks = hooks;

/**
 * Setup `runner.afterEach` to be called after every spec. 
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.  Must be a reference to the same array
 *   instance used by the framework
 */
exports.setup = function(runner, specs) {
  hooks.afterEach = runner.afterEach.bind(runner);
  specs.push(path.resolve(__dirname, '__protractor_internal_afterEach_setup_spec.js'));
};
