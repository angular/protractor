let RunnerReporter = function(emitter) {
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
  const specInfo = {
    name: result.description,
    category: result.fullName.slice(0, -result.description.length).trim()
  };
  if (result.status == 'passed') {
    this.emitter.emit('testPass', specInfo);
  } else if (result.status == 'failed') {
    this.emitter.emit('testFail', specInfo);
    this.failedCount++;
  }

  const entry = {
    description: result.fullName,
    assertions: [],
    duration: new Date().getTime() - this.startTime.getTime()
  };

  if (result.failedExpectations.length === 0) {
    entry.assertions.push({
      passed: true
    });
  }

  result.failedExpectations.forEach(item => {
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
 * @return {Promise} Promise resolved with the test results
 */
exports.run = async function(runner, specs) {
  const JasmineRunner = require('jasmine');
  const jrunner = new JasmineRunner();

  const jasmineNodeOpts = runner.getConfig().jasmineNodeOpts;

  // On timeout, the flow should be reset. This will prevent webdriver tasks
  // from overflowing into the next test and causing it to fail or timeout
  // as well. This is done in the reporter instead of an afterEach block
  // to ensure that it runs after any afterEach() blocks with webdriver tasks
  // get to complete first.
  const reporter = new RunnerReporter(runner);
  jasmine.getEnv().addReporter(reporter);

  // Jasmine 3 allows for tests to be in random order by default. This does not
  // work well with e2e tests where the browser state is determined by the
  // order of the tests. Setting to false will prevent random execution.
  // See https://jasmine.github.io/api/3.3/Env.html
  jasmine.getEnv().randomizeTests(false);

  // Add hooks for afterEach
  require('./setupAfterEach').setup(runner, specs);

  // Filter specs to run based on jasmineNodeOpts.grep and jasmineNodeOpts.invert.
  jasmine.getEnv().specFilter = function(spec) {
    var grepMatch = !jasmineNodeOpts ||
        !jasmineNodeOpts.grep ||
        spec.getFullName().match(new RegExp(jasmineNodeOpts.grep)) != null;
    var invertGrep = !!(jasmineNodeOpts && jasmineNodeOpts.invertGrep);
    if (grepMatch == invertGrep) {
      spec.disable();
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

  await runner.runTestPreparer();
  return new Promise((resolve, reject) => {
    if (jasmineNodeOpts && jasmineNodeOpts.defaultTimeoutInterval) {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineNodeOpts.defaultTimeoutInterval;
    }

    const originalOnComplete = runner.getConfig().onComplete;

    jrunner.onComplete(async(passed) => {
      try {
        if (originalOnComplete) {
          await originalOnComplete(passed);
        }
        resolve({
          failedCount: reporter.failedCount,
          specResults: reporter.testResult
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
};
