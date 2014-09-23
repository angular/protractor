var protractor = require('./protractor'),
    webdriver = require('selenium-webdriver'),
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
 * Internal helper for abstraction of polymorphic filenameOrFn properties.
 * @private
 * @param {object} filenameOrFn The filename or function that we will execute.
 * @return {object} A number or a promise that will resolve when the test
 *     preparers are finished.
 */
Runner.prototype.runFilenameOrFn_ = function(filenameOrFn, args) {
  if (filenameOrFn) {
    if (typeof filenameOrFn === 'function') {
      return filenameOrFn.apply(null, args);
    } else if (typeof filenameOrFn === 'string') {
      return require(path.resolve(this.config_.configDir, filenameOrFn));
    } else {
      // TODO - this is not generic.
      throw 'config.onPrepare and config.onCleanUp must be a string or function';
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
 * @public
 * @return {q.Promise} A promise that will resolve when the test preparers
 *     are finished.
 */
Runner.prototype.runTestPreparers = function() {
  var filenameOrFn;
  var promises = [];
  var returned;
  for (var i = 0; i < this.preparers_.length; i++) {
    filenameOrFn = this.preparers_[i];
    returned = this.runFilenameOrFn_(filenameOrFn);
    if (q.isPromiseAlike(returned)) {
      promises.push(returned);
    }
  }
  return q.all(promises);
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
    runnerPath = './driverProviders/chrome';
  } else if (this.config_.seleniumAddress) {
    runnerPath = './driverProviders/hosted';
  } else if (this.config_.sauceUser && this.config_.sauceKey) {
    runnerPath = './driverProviders/sauce';
  } else if (this.config_.seleniumServerJar) {
    runnerPath = './driverProviders/local';
  } else if (this.config_.mockSelenium) {
    runnerPath = './driverProviders/mock';
  } else {
    runnerPath = './driverProviders/local';
  }

  this.driverprovider_ = require(runnerPath)(this.config_);
};


/**
 * Responsible for cleaning up test run and exiting the process.
 * @private
 * @param {int} Standard unix exit code
 */
Runner.prototype.exit_ = function(exitCode) {
  var returned = this.runFilenameOrFn_(this.config_.onCleanUp, [exitCode]);
  if (typeof returned === 'number' || q.isPromiseAlike(returned)) {
    return returned;
  } else {
    return exitCode;
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
 * Get the control flow used by this runner.
 * @return {Object} WebDriver control flow.
 */
Runner.prototype.controlFlow = function() {
  return webdriver.promise.controlFlow();
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

  driver.getCapabilities().then(function(caps) {
    // Internet Explorer does not accept data URLs, which are the default
    // reset URL for Protractor.
    // Safari accepts data urls, but SafariDriver fails after one is used.
    var browserName = caps.get('browserName');
    if (browserName === 'internet explorer' || browserName === 'safari') {
      browser.resetUrl = 'about:blank';
    }
  });

  if (this.config_.getPageTimeout) {
    browser.getPageTimeout = this.config_.getPageTimeout;
  }

  // Export protractor to the global namespace to be used in tests.
  global.protractor = protractor;
  global.browser = browser;
  global.$ = browser.$;
  global.$$ = browser.$$;
  global.element = browser.element;
  global.by = global.By = protractor.By;

  // Enable sourcemap support for stack traces.
  require('source-map-support').install();
  // Required by dart2js machinery.
  // https://code.google.com/p/dart/source/browse/branches/bleeding_edge/dart/sdk/lib/js/dart2js/js_dart2js.dart?spec=svn32943&r=32943#487
  global.DartObject = function(o) { this.o = o; };
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
    return q.all(
        [self.config_.capabilities, self.config_.multiCapabilities]).
        spread(function(capabilites, multiCapabilities) {
          self.config_.capabilities = capabilites;
          self.config_.multiCapabilities = multiCapabilities;
        }).then(function() {
          driver = self.driverprovider_.getDriver();
        });

    // 2) Execute test cases
  }).then(function() {
    var deferred = q.defer();
    driver.manage().timeouts().setScriptTimeout(self.config_.allScriptsTimeout);
    self.setupGlobals_.bind(self)(driver);


    // Do the framework setup here so that jasmine and mocha globals are
    // available to the onPrepare function.
    var frameworkPath = '';
    if (self.config_.framework === 'jasmine') {
      frameworkPath = './frameworks/jasmine.js';
    } else if (self.config_.framework === 'mocha') {
      frameworkPath = './frameworks/mocha.js';
    } else if (self.config_.framework === 'cucumber') {
      frameworkPath = './frameworks/cucumber.js';
    } else if (self.config_.framework === 'debugprint') {
      frameworkPath = './frameworks/debugprint.js';
    } else {
      throw new Error('config.framework (' + self.config_.framework +
          ') is not a valid framework.');
    }
    require(frameworkPath).run(self, specs, function(result) {
      deferred.resolve(result);
    });

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
    return q.when(self.exit_(exitCode));
  });
};

/**
 * Creates and returns a Runner instance
 *
 * @public
 * @param {Object} config
 */
module.exports = Runner;
