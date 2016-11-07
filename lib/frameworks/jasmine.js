var q = require('q');
var webdriver = require('selenium-webdriver');

var RunnerReporter = function(emitter) {
  this.emitter = emitter;
  this.testResult = [],
  this.failedCount = 0;
};

RunnerReporter.prototype.jasmineStarted = function() {
  // Need to initiate startTime here, in case reportSpecStarting is not
  // called (e.g. when fit is used)
  this.startTime = new Date();
};

RunnerReporter.prototype.specStarted = function() {
  this.startTime = new Date();
};

RunnerReporter.prototype.specDone = function(result) {
  var specInfo = {
    name: result.description,
    category: result.fullName.slice(0, -result.description.length).trim()
  };
  if (result.status == 'passed') {
    this.emitter.emit('testPass', specInfo);
  } else if (result.status == 'failed') {
    this.emitter.emit('testFail', specInfo);
    this.failedCount++;
  }

  var entry = {
    description: result.description,
    assertions: [],
    duration: new Date().getTime() - this.startTime.getTime()
  };

  if (result.failedExpectations.length === 0) {
    entry.assertions.push({
      passed: true
    });
  }

  result.failedExpectations.forEach(function(item) {
    entry.assertions.push({
      passed: item.passed,
      errorMsg: item.passed ? undefined : item.message,
      stackTrace: item.passed ? undefined : item.stack
    });
  });
  this.testResult.push(entry);
};

/**
 * Execute the Runner's test cases through Jasmine.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  var JasmineRunner = require('jasmine');
  var jrunner = new JasmineRunner();
  /* global jasmine */

  require('jasminewd2').init(webdriver.promise.controlFlow());

  var jasmineNodeOpts = runner.getConfig().jasmineNodeOpts;

  // On timeout, the flow should be reset. This will prevent webdriver tasks
  // from overflowing into the next test and causing it to fail or timeout
  // as well. This is done in the reporter instead of an afterEach block
  // to ensure that it runs after any afterEach() blocks with webdriver tasks
  // get to complete first.
  var reporter = new RunnerReporter(runner);
  jasmine.getEnv().addReporter(reporter);

  // Filter specs to run based on jasmineNodeOpts.grep and jasmineNodeOpts.invert.
  jasmine.getEnv().specFilter = function(spec) {
    var grepMatch = !jasmineNodeOpts ||
        !jasmineNodeOpts.grep ||
        spec.getFullName().match(new RegExp(jasmineNodeOpts.grep)) != null;
    var invertGrep = !!(jasmineNodeOpts && jasmineNodeOpts.invertGrep);
    if (grepMatch == invertGrep) {
      spec.pend();
    }
    return true;
  };

  // Run specs in semi-random order
  if (jasmineNodeOpts.random) {
    jasmine.getEnv().randomizeTests(true);

    // Sets the randomization seed if randomization is turned on
    if (jasmineNodeOpts.seed) {
      jasmine.getEnv().seed(jasmineNodeOpts.seed);
    }
  }

  return runner.runTestPreparer().then(function() {
    return q.promise(function(resolve, reject) {
      if (jasmineNodeOpts && jasmineNodeOpts.defaultTimeoutInterval) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineNodeOpts.defaultTimeoutInterval;
      }

      var originalOnComplete = runner.getConfig().onComplete;

      jrunner.onComplete(function(passed) {
        try {
          var completed = q();
          if (originalOnComplete) {
            completed = q(originalOnComplete(passed));
          }
          completed.then(function() {
            resolve({
              failedCount: reporter.failedCount,
              specResults: reporter.testResult
            });
          });
        } catch (err) {
          reject(err);
        }
      });

      jrunner.configureDefaultReporter(jasmineNodeOpts);
      jrunner.projectBaseDir = '';
      jrunner.specDir = '';
      jrunner.addSpecFiles(specs);
      jrunner.execute();
    });
  });
};
