/**
 * Jasmine framework dummy alias to prove Protractor supports
 * external custom frameworks.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 */
exports.run = require('../../built/lib/frameworks/jasmine.js').run;
