var q = require('q');
var fs = require('fs');

/**
 * Execute the Runner's test cases through Mocha.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  var Mocha = require('mocha'),
      mocha = new Mocha(runner.getConfig().mochaOpts);

  var deferred = q.defer();

  // Mocha doesn't set up the ui until the pre-require event, so
  // wait until then to load mocha-webdriver adapters as well.
  mocha.suite.on('pre-require', function() {
    try {
      // We need to re-wrap all of the global functions, which selenium-webdriver/
      // testing only does when it is required. So first we must remove it from
      // the cache.
      delete require.cache[require.resolve('selenium-webdriver/testing')];
      var mochaAdapters = require('selenium-webdriver/testing');
      global.after = mochaAdapters.after;
      global.afterEach = mochaAdapters.afterEach;
      global.before = mochaAdapters.before;
      global.beforeEach = mochaAdapters.beforeEach;

      // The implementation of mocha's it.only uses global.it, so since that has
      // already been wrapped we must avoid wrapping it a second time.
      // See Mocha.prototype.loadFiles and bdd's context.it.only for more details.
      var originalOnly = global.it.only;
      global.it = mochaAdapters.it;
      global.it.only = global.iit = originalOnly;

      global.it.skip = global.xit = mochaAdapters.xit;
    } catch(err){
      deferred.reject(err);
    }
  });

  mocha.loadFiles();

  runner.runTestPreparer().then(function() {

    specs.forEach(function(file) {
      mocha.addFile(file);
    });

    var mochaRunner = mocha.run(function(failures) {
      try {
        if (runner.getConfig().onComplete) {
          runner.getConfig().onComplete();
        }
        var resolvedObj = {
          failedCount: failures
        };

        deferred.resolve(resolvedObj);
      } catch(err){
        deferred.reject(err);
      }
    });

    var jsonOutput = [];

    mochaRunner.on('end', function() {
      // If store results to json file
      var testResultFile = runner.getConfig().testResultOutput;
      if (testResultFile) {
        if (fs.existsSync(testResultFile)) {
          var prevDataRaw = fs.readFileSync(testResultFile);
          var prevDataJson = JSON.parse(prevDataRaw);
          jsonOutput = jsonOutput.concat(prevDataJson);
        }

        var json = JSON.stringify(jsonOutput, null, '  ');
        fs.writeFileSync(testResultFile, json); 
      }
    });

    mochaRunner.on('pass', function(test) {
      runner.emit('testPass');
      if (runner.getConfig().testResultOutput) {
        jsonOutput.push({
          result: [{
            passed: true
          }],
          duration: test.duration
        });
      }
    });

    mochaRunner.on('fail', function(test) {
      runner.emit('testFail');
      if (runner.getConfig().testResultOutput) {
        jsonOutput.push({
          result: [{
            passed: false,
            errorMsg: test.err.message,
            stacktrace: test.err.stack 
          }],
          duration: test.duration
        });
      }
    });

  }).catch(function(reason){
      deferred.reject(reason);
  });

  return deferred.promise;
};
