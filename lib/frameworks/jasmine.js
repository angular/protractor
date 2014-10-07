var q = require('q');

/**
 * Execute the Runner's test cases through Jasmine.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  var minijn = require('minijasminenode');

  require('jasminewd');
  /* global jasmine */

  var RunnerReporter = function(emitter) {
    this.emitter = emitter;
  };

  RunnerReporter.prototype.reportRunnerStarting = function() {};
  RunnerReporter.prototype.reportRunnerResults = function() {};
  RunnerReporter.prototype.reportSuiteResults = function() {};
  RunnerReporter.prototype.reportSpecStarting = function() {};
  RunnerReporter.prototype.reportSpecResults = function(spec) {
    if (spec.results().passed()) {
      this.emitter.emit('testPass');
    } else {
      this.emitter.emit('testFail');
    }
  };
  RunnerReporter.prototype.log = function() {};

  // On timeout, the flow should be reset. This will prevent webdriver tasks
  // from overflowing into the next test and causing it to fail or timeout
  // as well. This is done in the reporter instead of an afterEach block
  // to ensure that it runs after any afterEach() blocks with webdriver tasks
  // get to complete first.
  jasmine.getEnv().addReporter(new RunnerReporter(runner));

  return runner.runTestPreparer().then(function() {
    return q.promise(function (resolve, reject) {
      var jasmineNodeOpts = runner.getConfig().jasmineNodeOpts;
      var originalOnComplete = runner.getConfig().onComplete;

      jasmineNodeOpts.onComplete = function(jasmineRunner, log) {
        try {
          if (originalOnComplete) {
            originalOnComplete(jasmineRunner, log);
          }
          resolve(jasmineRunner.results());
        } catch(err) {
          reject(err);
        }
      };

      minijn.addSpecs(specs);
      minijn.executeSpecs(jasmineNodeOpts);
    });
  });
};
