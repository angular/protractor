/**
 * Execute the Runner's test cases through Mocha.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @param done A callback for when tests are finished.
 */
exports.run = function(runner, specs, done) {

  var Mocha = require('mocha'),
      mocha = new Mocha(runner.getConfig().mochaOpts);

  // Mocha doesn't set up the ui until the pre-require event, so
  // wait until then to load mocha-webdriver adapters as well.
  mocha.suite.on('pre-require', function() {
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
  });

  mocha.suite.on('pass', function() {
    runner.emit('testPass');
  });

  mocha.suite.on('fail', function() {
    runner.emit('testFail');
  });

  mocha.loadFiles();

  runner.controlFlow().execute(function() {
    runner.runTestPreparers();
  }, 'run test preparers').then(function() {

    specs.forEach(function(file) {
      mocha.addFile(file);
    });

    mocha.run(function(failures) {
      if (runner.getConfig().onComplete) {
        runner.getConfig().onComplete();
      }
      var resolvedObj = {
        failedCount: failures
      };

      done(resolvedObj);
    });
  });
};
