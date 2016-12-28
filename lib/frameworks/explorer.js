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
    browser.executeScriptWithDescription('var e = 0', 'starting explorer hook');  
    browser.enterRepl();
    browser.executeScriptWithDescription('var e = 1', 'done with explorer hook').then(function() {
      resolve({
        failedCount: 0
      });
    });
  });
};
