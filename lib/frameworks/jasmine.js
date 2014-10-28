var q = require('q');
var fs = require('fs');

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
    this.jsonOutput = [];
  };

  RunnerReporter.prototype.reportRunnerStarting = function() {};
  RunnerReporter.prototype.reportRunnerResults = function() {
    // If store results to json file
    var testResultFile = runner.getConfig().testResultOutput;
    if (testResultFile) {
      if (fs.existsSync(testResultFile)) {
        var prevDataRaw = fs.readFileSync(testResultFile);
        var prevDataJson = JSON.parse(prevDataRaw);
        this.jsonOutput = this.jsonOutput.concat(prevDataJson);
      }

      var json = JSON.stringify(this.jsonOutput, null, '  ');
      fs.writeFileSync(testResultFile, json); 
    }
  };
  RunnerReporter.prototype.reportSuiteResults = function() {};
  RunnerReporter.prototype.reportSpecStarting = function() {
    this.startTime = new Date();
  };
  RunnerReporter.prototype.reportSpecResults = function(spec) {
    if (spec.results().passed()) {
      this.emitter.emit('testPass');
    } else {
      this.emitter.emit('testFail');
    }

    if (runner.getConfig().testResultOutput) {
      var entry = {
        result: [],
        duration: new Date().getTime() - this.startTime.getTime()
      };
      spec.results().getItems().forEach(function(item) {
        entry.result.push({
          passed: item.passed(),
          errorMsg: item.message,
          stacktrace: item.trace.stack 
        });
      });
      this.jsonOutput.push(entry);
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
