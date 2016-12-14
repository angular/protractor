var q = require('q');

/**
 * A framework which does not actually run any tests. It allows users to drop
 * into a repl loop to experiment with protractor commands.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner) {
  /* globals browser */
  return q.promise(function(resolve) {
    if (runner.getConfig().baseUrl) {
      browser.get(runner.getConfig().baseUrl);
    }
    browser.executeScriptWithDescription('var prehook = 1', 'test to be removed, should happen first');
    browser.enterRepl();
    browser.executeScriptWithDescription('var lastHook = 1', 'last empty debugger hook').then(function() {
      console.log('**** explorer mode is done, resolving');
      resolve({
        failedCount: 0
      });
    });
    console.log(browser.controlFlow().getSchedule());
  });
};
