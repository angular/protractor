var protractor = require('./protractor'),
    webdriver = require('selenium-webdriver'),
    ConfigParser = require('./configParser'),
    path = require('path'),
    util = require('util'),
    q = require('q'),
    EventEmitter = require('events').EventEmitter;

/*
 * Runner is responsible for starting the execution of a test run and triggering
 * setup, teardown, managing config, etc through its various dependencies.
 *
 * The Protractor Runner is a node EventEmitter with the following events:
 * - testPass
 * - testFail
 * - testsDone
 *
 * @param {Object} config
 * @constructor
 */
var Runner = function(config) {
  this.preparers_ = [];
  this.driverprovider_ = null;
  this.config_ = config;

  if (config.v8Debug) {
    // Call this private function instead of sending SIGUSR1 because Windows.
    process._debugProcess(process.pid);
  }

  if (config.nodeDebug) {
    process._debugProcess(process.pid);
    var flow = webdriver.promise.controlFlow();

    flow.execute(function() {
      var nodedebug = require('child_process').fork('debug', ['localhost:5858']);
      process.on('exit', function() {
        nodedebug.kill('SIGTERM');
      });
      nodedebug.on('exit', function() {
        process.exit('1');
      });
    }, 'start the node debugger');
    flow.timeout(1000, 'waiting for debugger to attach');
  }

  this.loadDriverProvider_(config);
};

util.inherits(Runner, EventEmitter);


/**
 * Execute the Runner's test cases through Jasmine.
 *
 * @private
 * @param {Array} specs Array of Directory Path Strings
 * @param done A callback for when tests are finished.
 */
Runner.prototype.runJasmine_ = function(specs, done) {
  var minijn = require('minijasminenode'),
      self = this;

  require('../jasminewd');
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
  jasmine.getEnv().addReporter(new RunnerReporter(this));

  webdriver.promise.controlFlow().execute(function() {
    self.runTestPreparers_();
  }, 'run test preparers').then(function() {
    var jasmineNodeOpts = self.config_.jasmineNodeOpts;
    var originalOnComplete = self.config_.onComplete;
    jasmineNodeOpts.onComplete = function(runner, log) {
      if (originalOnComplete) {
        originalOnComplete(runner, log);
      }
      done(runner.results());
    };

    minijn.addSpecs(specs);
    minijn.executeSpecs(jasmineNodeOpts);
  });
};


/**
 * Execute the Runner's test cases through Mocha.
 *
 * @private
 * @param {Array} specs Array of Directory Path Strings
 * @param done A callback for when tests are finished.
 */
Runner.prototype.runMocha_ = function(specs, done) {

  var Mocha = require('mocha'),
      mocha = new Mocha(this.config_.mochaOpts),
      self = this;

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
    this.emit('testPass');
  });

  mocha.suite.on('fail', function() {
    this.emit('testFail');
  });

  mocha.loadFiles();

  webdriver.promise.controlFlow().execute(function() {
    self.runTestPreparers_();
  }, 'run test preparers').then(function() {

    specs.forEach(function(file) {
      mocha.addFile(file);
    });

    mocha.run(function(failures) {
      if (self.config_.onComplete) {
        self.config_.onComplete();
      }
      var resolvedObj = {
        failedCount: failures
      };

      done(resolvedObj);
    });
  });
};

/**
 * Execute the Runner's test cases through Cucumber.
 *
 * @private
 * @param {Array} specs Array of Directory Path Strings
 * @param done A callback for when tests are finished.
 */
Runner.prototype.runCucumber_ = function(specs, done) {
  // TODO - add the event interface for cucumber.
  var Cucumber = require('cucumber'),
      self = this,
      execOptions = ['node', 'node_modules/.bin/cucumber-js'],
      cucumberResolvedRequire;

  // Set up exec options for Cucumber
  execOptions = execOptions.concat(specs);
  if (self.config_.cucumberOpts) {

    // Process Cucumber Require param
    if (self.config_.cucumberOpts.require) {
      cucumberResolvedRequire =
          ConfigParser.resolveFilePatterns(self.config_.cucumberOpts.require);
      if (cucumberResolvedRequire && cucumberResolvedRequire.length) {
          execOptions = cucumberResolvedRequire.reduce(function(a, fn) {
            return a.concat('-r', fn);
          }, execOptions);
      }
    }

    // Process Cucumber Tag param
    if (Array.isArray(self.config_.cucumberOpts.tags)) {
        for (var i in self.config_.cucumberOpts.tags) {
            var tags = self.config_.cucumberOpts.tags[i];
            execOptions.push('-t');
            execOptions.push(tags);
        }
    } else if (self.config_.cucumberOpts.tags) {
      execOptions.push('-t');
      execOptions.push(self.config_.cucumberOpts.tags);
    }

    // Process Cucumber Format param
    if (self.config_.cucumberOpts.format) {
      execOptions.push('-f');
      execOptions.push(self.config_.cucumberOpts.format);
    }
  }
  global.cucumber = Cucumber.Cli(execOptions);

  webdriver.promise.controlFlow().execute(function() {
    self.runTestPreparers_();
  }, 'run test preparers').then(function() {

    global.cucumber.run(function(succeeded) {
      if (self.config_.onComplete) {
        self.config_.onComplete();
      }
      var resolvedObj = {
        failedCount: succeeded ? 0 : 1
      };
      done(resolvedObj);
    });
  });
};


/**
 * Internal helper for abstraction of polymorphic filenameOrFn properties.
 * @private
 * @param {Array} source The Array that we'll be iterating through
 *    as we evaluate whether to require or execute each item.
 */
Runner.prototype.runFilenamesOrFns_ = function(source) {
  var filenameOrFn;
  for (var i = 0; i < source.length; i++) {
    filenameOrFn = source[i];
    if (filenameOrFn) {
      if (typeof filenameOrFn === 'function') {
        filenameOrFn();
      } else if (typeof filenameOrFn === 'string') {
        require(path.resolve(this.config_.configDir, filenameOrFn));
      } else {
        // TODO - this is not generic.
        throw 'config.onPrepare must be a string or function';
      }
    }
  }
};


/**
 * Registrar for testPreparers - executed right before tests run.
 * @public
 * @param {string/Fn} filenameOrFn
 */
Runner.prototype.registerTestPreparer = function(filenameOrFn) {
  this.preparers_.push(filenameOrFn);
};


/**
 * Executor of testPreparers
 * @private
 */
Runner.prototype.runTestPreparers_ = function() {
  this.runFilenamesOrFns_(this.preparers_);
};


/**
 * Grab driver provider based on type
 * @private
 *
 * Priority
 * 1) if chromeOnly, use that
 * 2) if seleniumAddress is given, use that
 * 3) if a sauceAccount is given, use that.
 * 4) if a seleniumServerJar is specified, use that
 * 5) try to find the seleniumServerJar in protractor/selenium
 */
Runner.prototype.loadDriverProvider_ = function() {
  var runnerPath;
  if (this.config_.chromeOnly) {
    runnerPath = './driverProviders/chrome.dp';
  } else if (this.config_.seleniumAddress) {
    runnerPath = './driverProviders/hosted.dp';
  } else if (this.config_.sauceUser && this.config_.sauceKey) {
    runnerPath = './driverProviders/sauce.dp';
  } else if (this.config_.seleniumServerJar) {
    runnerPath = './driverProviders/local.dp';
  } else {
    runnerPath = './driverProviders/local.dp';
  }

  this.driverprovider_ = require(runnerPath)(this.config_);
};


/**
 * Responsible for cleaning up test run and exiting the process.
 * @private
 * @param {int} Standard unix exit code
 */
Runner.prototype.exit_ = function(exitCode) {
  if (typeof this.config_.onCleanUp === 'function') {
    this.config_.onCleanUp(exitCode);
  }
};


/**
 * Getter for the Runner config object
 * @public
 * @return {Object} config
 */
Runner.prototype.getConfig = function() {
  return this.config_;
};


/**
 * Sets up convenience globals for test specs
 * @private
 */
Runner.prototype.setupGlobals_ = function(driver) {
  var browser = protractor.wrapDriver(
      driver,
      this.config_.baseUrl,
      this.config_.rootElement);

  browser.params = this.config_.params;
  protractor.setInstance(browser);

  // Export protractor to the global namespace to be used in tests.
  global.protractor = protractor;
  global.browser = browser;
  global.$ = browser.$;
  global.$$ = browser.$$;
  global.element = browser.element;
  global.by = global.By = protractor.By;
};

/**
 * The primary workhorse interface. Kicks off the test running process.
 *
 * @return {q.Promise} A promise which resolves to the exit code of the tests.
 * @public
 */
Runner.prototype.run = function() {
  var self = this,
      driver,
      specs,
      testResult;

  specs = this.config_.specs;

  if (!specs.length) {
    throw new Error('Spec patterns did not match any files.');
  }

  this.registerTestPreparer(this.config_.onPrepare);

  // 1) Setup environment
  return this.driverprovider_.setupEnv().then(function() {
    driver = self.driverprovider_.getDriver();
    return q.fcall(function() {});

    // 2) Execute test cases
  }).then(function() {

    var deferred = q.defer();
    driver.manage().timeouts().setScriptTimeout(self.config_.allScriptsTimeout);
    self.setupGlobals_.bind(self)(driver);


    // Do the framework setup here so that jasmine and mocha globals are
    // available to the onPrepare function.
    if (self.config_.framework === 'jasmine') {
      self.runJasmine_.bind(self)(specs, function(result) {
        deferred.resolve(result);
      });
    } else if (self.config_.framework === 'mocha') {
      self.runMocha_.bind(self)(specs, function(result) {
        deferred.resolve(result);
      });
    } else if (self.config_.framework === 'cucumber') {
      self.runCucumber_.bind(self)(specs, function(result) {
        deferred.resolve(result);
      });
    } else if (self.config_.framework === 'simpleprint') {
      console.log('Resolved spec files ' + util.inspect(specs));
      deferred.resolve({failedCount: 0});
    } else {
      throw new Error('config.framework (' + self.config_.framework +
          ') is not a valid framework.');
    }

    return deferred.promise;

  // 3) Teardown
  }).then(function(result) {
    self.emit('testsDone', result.failedCount);
    testResult = result;
    if (self.driverprovider_.updateJob) {
      return self.driverprovider_.updateJob({
            'passed': testResult.failedCount === 0
          }).then(function() {
            return self.driverprovider_.teardownEnv();
          });
    } else {
      return self.driverprovider_.teardownEnv();
    }
  // 4) Exit process
  }).then(function() {
    var passed = testResult.failedCount === 0;
    var exitCode = passed ? 0 : 1;
    self.exit_(exitCode);
    return exitCode;
  });
};

/**
 * Creates and returns a Runner instance
 *
 * @public
 * @param {Object} config
 */
module.exports = Runner;
