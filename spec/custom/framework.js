/**
 * Jasmine framework dummy alias to prove Protractor supports
 * external custom frameworks.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = require('../../lib/frameworks/jasmine.js').run;
