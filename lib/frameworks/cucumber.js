var ConfigParser = require('../configParser'),
  q = require('q');

/**
 * Execute the Runner's test cases through Cucumber.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  // TODO - add the event interface for cucumber.
  var Cucumber = require('cucumber'),
      execOptions = ['node', 'node_modules/.bin/cucumber-js'],
      cucumberResolvedRequire;

  // Set up exec options for Cucumber
  execOptions = execOptions.concat(specs);
  if (runner.getConfig().cucumberOpts) {

    // Process Cucumber Require param
    if (runner.getConfig().cucumberOpts.require) {
      // TODO - this should move into the launcher.
      cucumberResolvedRequire =
          ConfigParser.resolveFilePatterns(
              runner.getConfig().cucumberOpts.require,
              false,
              runner.getConfig().configDir);
      if (cucumberResolvedRequire && cucumberResolvedRequire.length) {
          execOptions = cucumberResolvedRequire.reduce(function(a, fn) {
            return a.concat('-r', fn);
          }, execOptions);
      }
    }

    // Process Cucumber Tag param
    if (Array.isArray(runner.getConfig().cucumberOpts.tags)) {
        for (var i in runner.getConfig().cucumberOpts.tags) {
            var tags = runner.getConfig().cucumberOpts.tags[i];
            execOptions.push('-t');
            execOptions.push(tags);
        }
    } else if (runner.getConfig().cucumberOpts.tags) {
      execOptions.push('-t');
      execOptions.push(runner.getConfig().cucumberOpts.tags);
    }

    // Process Cucumber Format param
    if (runner.getConfig().cucumberOpts.format) {
      execOptions.push('-f');
      execOptions.push(runner.getConfig().cucumberOpts.format);
    }

    // Process Cucumber 'coffee' param
    if (runner.getConfig().cucumberOpts.coffee) {
      execOptions.push('--coffee');
    }
  }
  global.cucumber = Cucumber.Cli(execOptions);

  var testResult = [];

  var scenarioFailed = false;
  var failedCount = 0; 
  // Add a listener into cucumber so that protractor can find out which
  // steps passed/failed
  var addResultListener = function(formatter) {

    var originalHandleBeforeFeatureEvent = formatter.handleBeforeFeatureEvent;
    formatter.handleBeforeFeatureEvent = function (event, callback) {
      var feature = event.getPayloadItem('feature');
      var currentFeatureId = feature.getName().replace(/ /g, '-');
      var featureOutput = {
        id:          currentFeatureId,
        name:        feature.getName(),
        description: feature.getDescription(),
        line:        feature.getLine(),
        keyword:     feature.getKeyword(),
        uri:         feature.getUri(),
        elements:    []
      };

      testResult.push(featureOutput);
      
      if (originalHandleBeforeFeatureEvent 
          && typeof(originalHandleBeforeFeatureEvent) === 'function') {
            originalHandleBeforeFeatureEvent(event, callback);
      } else {
        callback();
      }
    }

    var originalHandleBeforeScenarioEvent = formatter.handleBeforeScenarioEvent;
    formatter.handleBeforeScenarioEvent = function(event, callback) {
      var scenario = event.getPayloadItem('scenario');
      var currentScenarioId = testResult[testResult.length - 1].id + ';' + scenario.getName().replace(/ /g, '-');
      var scenarioOutput = {
        id:          currentScenarioId,
        name:        scenario.getName(),
        description: scenario.getDescription(),
        line:        scenario.getLine(),
        keyword:     scenario.getKeyword(),
        steps:       [] 
      };

      if (scenarioFailed) {
        ++failedCount;
        runner.emit('testFail');
      } else {
        runner.emit('testPass');
      }

      testResult[testResult.length - 1].elements.push(scenarioOutput);

      if (originalHandleBeforeScenarioEvent 
          && typeof(originalHandleBeforeScenarioEvent) === 'function') {
            originalHandleBeforeScenarioEvent(event, callback);
      } else {
        callback();
      }
    };

    var originalHandleStepResultEvent = formatter.handleStepResultEvent;
    formatter.handleStepResultEvent = function(event, callback) {
      var stepResult = event.getPayloadItem('stepResult');
      var steps = stepResult.getStep();

      var stepOutput = {
        name:    steps.getName(),
        line:    steps.getLine(),
        keyword: steps.getKeyword(),
        results: {},
        match: {}
      };
      var resultStatus;
      var attachments;

      if (stepResult.isSuccessful()) {
        resultStatus = 'passed';
        if (stepResult.hasAttachments()) {
          attachments = stepResult.getAttachments();
        }
        stepOutput.results.duration = stepResult.getDuration();
      }
      else if (stepResult.isPending()) {
        resultStatus = 'pending';
        stepOutput.results.error_message = undefined;
      }
      else if (stepResult.isSkipped()) {
        resultStatus = 'skipped';
      }
      else if (stepResult.isUndefined()) {
        resultStatus = 'undefined';
      }
      else {
        resultStatus = 'failed';
        var failureMessage = stepResult.getFailureException();
        if (failureMessage) {
          stepOutput.results.error_message = (failureMessage.stack || failureMessage);
        }
        if (stepResult.hasAttachments()) {
          attachments = stepResult.getAttachments();
        }
        stepOutput.results.duration = stepResult.getDuration();
      }

      stepOutput.results.status = resultStatus;

      if (attachments) {
        attachments.syncForEach(function(attachment) {
          //TODO: formatter.embedding
        });
      }

      testResult[testResult.length - 1].elements[testResult[testResult.length - 1].elements.length - 1].steps.push(stepOutput);

      if (originalHandleStepResultEvent 
          && typeof(originalHandleStepResultEvent) === 'function') {
            originalHandleStepResultEvent(event, callback);
      } else {
        callback();
      }
    };
  };

  return runner.runTestPreparer().then(function() {
    return q.promise(function(resolve, reject) {
      var cucumberConf = Cucumber.Cli.Configuration(execOptions);
      var runtime   = Cucumber.Runtime(cucumberConf);
      var formatter = cucumberConf.getFormatter();
      addResultListener(formatter);
      runtime.attachListener(formatter);
      runtime.start(function() {
        try {
          if (runner.getConfig().onComplete) {
            runner.getConfig().onComplete();
          }
          resolve({
            failedCount: failedCount,
            specResults: testResult
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  });
};
