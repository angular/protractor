var protractor = require(__dirname+'/protractor.js'),
    webdriver = require('selenium-webdriver'),
    configParser = require(__dirname+'/configParser'),
    path = require('path'),
    util = require('util'),
    fs = require('fs'),
    q = require('q');

/*
 * This object serves as the primarily responsible party for starting the
 * execution of a test run and triggering setup, teardown, managing config,
 * etc through its various dependencies.
 */
function TestRunner(config) {

  this.config_= {
    specs: [],
    capabilities: {
      browserName: 'chrome'
    },
    seleniumHost: 'http://localhost:4444/wd/hub',
    rootElement: 'body',
    baseUrl: 'http://localhost',
    timeout: 11000,
    browserParams: {},
    framework: 'jasmine',
    jasmineOpts: {
      isVerbose: false,
      showColors: true,
      includeStackTrace: true,
      stackFilter: protractor.filterStackTrace,
      defaultTimeoutInterval: (30 * 1000)
    },
    cucumberOpts: {},
    mochaOpts: {
      ui: 'bdd',
      reporter: 'list'
    },
    seleniumLocal: {
      jar: null,
      args: [],
      port: null
    },
    sauceAccount: {},
    chromeDriver: null,
    configDir: './'
  };

  //properties set up internally
  this.preparers_ = [];
  this.cleaners_ = [];
  this.driverprovider_ = undefined;

  // Init
  configParser.loadConfig(this.config_,config);
  this.loadDriverProvider_(config);
}


/**
 * Sets up chromeDriver property.  Attempts to locate a default 
 * if none is provided
 * @private   
 */
TestRunner.prototype.setupChromeDriver_ = function() {
  var defaultChromedriver,
    userSpecified = !!(this.config_.chromeDriver);

  //use default if none was provided
  defaultChromedriver = (this.config_.chromeDriver) ?
      this.config_.chromeDriver :
      path.resolve(__dirname,'../../selenium/chromedriver');

  //check if file exists, if not try .exe or fail accordingly
  if (!fs.existsSync(defaultChromedriver)) {
    
    defaultChromedriver+='.exe';
    //throw error if the client specified conf chromedriver and its not found
    if (!fs.existsSync(defaultChromedriver) && userSpecified) {
      throw new Error('Could not find chromedriver at ' +
        defaultChromedriver);
    }
  }
  this.config_.chromeDriver = defaultChromedriver;
};


/**
 * Responsible for executing the testRunner's test cases through Jasmine
 * @private   
 * @param {Array} specs - Array of Directory Path Strings
 * @param deferred - the deferred object that we're going to resolve when
 *    Jasmine is done
 */
TestRunner.prototype.runJasmine_ = function(specs, callbackFn) {

  //jasmine setup
  var minijn = require('minijasminenode'),
      self = this;
  
  //inject on complete within flow and handle jasmine execution
  require('../jasminewd');
  webdriver.promise.controlFlow().execute(function() {
    self.runTestPreparers_();
  }).then(function() {
    var opt = self.config_.jasmineOpts;
    opt._originalOnComplete = self.config_.onComplete;
    opt.onComplete = function(runner, log) {
      if (opt._originalOnComplete) {
        opt._originalOnComplete(runner, log);
      }
      callbackFn(runner);
    };

    minijn.addSpecs(specs);
    minijn.executeSpecs(opt);
  });
};


/**
 * Responsible for executing the testRunner's test cases through Mocha
 * @private   
 * @param {Array} specs - Array of Directory Path Strings
 * @param deferred - the deferred object that we're going to resolve
 *    when Mocha is done
 */
TestRunner.prototype.runMocha_ = function(specs, callbackFn) {

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

    global.it = mochaAdapters.it;
    global.it.only = global.iit = mochaAdapters.it.only;
    global.it.skip = global.xit = mochaAdapters.xit;
  });

  mocha.loadFiles();

  webdriver.promise.controlFlow().execute(function() {
    self.runTestPreparers_();
  }).then(function() {

    specs.forEach(function(file) {
      mocha.addFile(file);
    });

    mocha.run(function(failures) {
      if (self.config_.onComplete) {
        self.config_.onComplete();
      }
      var resolvedObj = {
        results: function() {
          return {
            failedCount: failures
          };
        }
      };

      self.driverprovider_.getDriver().quit().then(function() {
        callbackFn(resolvedObj);
      });
    });
  });
};


TestRunner.prototype.runCucumber_ = function(specs, callbackFn) {
  var Cucumber = require('cucumber'),
      self = this,
      execOptions = ['node', 'node_modules/.bin/cucumber-js'],
      cucumberResolvedRequire;

  //Set up exec options for Cucumber
  execOptions = execOptions.concat(specs);
  if (self.config_.cucumberOpts) {

    //Process Cucumber Require param
    if (self.config_.cucumberOpts.require) {
      cucumberResolvedRequire =
          configParser.resolveFilePatterns(self.config_.cucumberOpts.require);
      if (cucumberResolvedRequire && cucumberResolvedRequire.length) {
          execOptions.push('-r');
          execOptions = execOptions.concat(cucumberResolvedRequire);
      }
    }

    //Process Cucumber Tag param
    if (self.config_.cucumberOpts.tags) {
      execOptions.push('-t');
      execOptions.push(self.config_.cucumberOpts.tags);
    }

    //Process Cucumber Format param
    if (self.config_.cucumberOpts.format) {
      execOptions.push('-f');
      execOptions.push(self.config_.cucumberOpts.format);
    }
  }
  cucumber = Cucumber.Cli(execOptions);

  webdriver.promise.controlFlow().execute(function() {
    self.runTestPreparers_();
  }).then(function() {

    cucumber.run(function(succeeded) {
      if (self.config_.onComplete) {
        self.config_.onComplete();
      }
      var resolvedObj = {
        results: function() {
          return {
            failedCount: succeeded ? 0 : 1
          };
        }
      };
      self.driverprovider_.getDriver().quit().then(function() {
        callbackFn(resolvedObj);
      });
    });
  });
};


/**
 * Internal helper for abstraction of polymorphic filenameOrFn properties
 * @private   
 * @param {Array} source - the Object Array that we'll be iterating through
 *    as we evaluate whether to require or execute each item.
 */
TestRunner.prototype.runFilenameOrFn_ = function(source) {
  var i, filenameOrFn;
  for (i=0; i<source.length; i++) {
    filenameOrFn = source[i];
    if (typeof filenameOrFn === 'function') {
      filenameOrFn();
    } else if (typeof filenameOrFn === 'string') {
      require(path.resolve(this.config_.configDir, filenameOrFn));
    } else {
      throw 'config.onPrepare must be a string or function';
    }
  }
};


/**
 * Registrar for testPreparers - executed right before tests run.
 * @public   
 * @param {string/Fn} filenameOrFn
 */
TestRunner.prototype.registerTestPreparer = function(filenameOrFn) {
  this.preparers_.push(filenameOrFn);
};


/**
 * Executor of testPreparers
 * @private   
 */
TestRunner.prototype.runTestPreparers_ = function() {
  this.runFilenameOrFn_(this.preparers_);
};


/**
 * Registrar for testCleaners - executed right after tests run.
 * @public
 * @param {string/Fn} filenameOrFn
 */
TestRunner.prototype.registerTestCleaners = function(filenameOrFn) {
  this.cleaners_.push(filenameOrFn);
};


/**
 * Executor of testCleaners
 * @private   
 */
TestRunner.prototype.runTestCleaners_ = function() {
  this.runFilenameOrFn_(this.cleaners_);
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
TestRunner.prototype.loadDriverProvider_ = function(userConfig) {
  if (userConfig.chromeOnly) {
    testRunnerPath = __dirname+'/driverProviders/chrome.dp';
  }
  else if (userConfig.seleniumAddress) {
    testRunnerPath = __dirname+'/driverProviders/hosted.dp';
  }
  else if (userConfig.sauceUser && userConfig.sauceKey) {
    testRunnerPath = __dirname+'/driverProviders/sauce.dp';
  }
  else if (userConfig.seleniumServerJar) {
    testRunnerPath = __dirname+'/driverProviders/local.dp';
  }
  else {
    testRunnerPath = __dirname+'/driverProviders/local.dp';
  }

  this.driverprovider_ = require(testRunnerPath)(this);
};


/**
 * Responsible for cleaning up test run and exiting the process.
 * @private
 * @param {int} Standard unix exit code
 */
TestRunner.prototype.exit_ = function(exitCode) {
  if (typeof config.onCleanUp === 'function') {
    config.onCleanUp(exitCode);
  }
  process.exit(exitCode);
};


/**
 * Getter for the testRunner config object
 * @public
 * @return {Object} config
 */
TestRunner.prototype.getConfig = function() {
  return this.config_;
};


/**
 * Sets up convenience globals for test specs
 * @private   
 */
TestRunner.prototype.setupGlobals_ = function(driver) {
  var globalEnv = {},
      browser = protractor.wrapDriver(
          driver,
          this.config_.baseUrl,
          this.config_.rootElement);

  browser.params = this.config_.browserParams;
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
 * The primary workhorse interface.  Kicks off the test running process.
 * This method is responsible for setting up and tearing down the test
 * environments as well as kicking of child test processes as necessary.
 * @public
 */
TestRunner.prototype.run = function() {

  var self = this,
      driver = {},
      specs,
      excludes;


  // Determine included and excluded specs based on file pattern
  excludes = configParser.resolveFilePatterns(this.config_.exclude, true);
  specs = configParser.resolveFilePatterns(this.config_.specs).filter(function (path) {
      return excludes.indexOf(path) < 0;
  });
  if (!specs.length) {
      throw new Error('Spec patterns did not match any files.');
  }

  //1) Setup environment
  this.driverprovider_.setupEnv().then(function() {
    driver = self.driverprovider_.getDriver();
    return driver.getSession();

  //2) Execute test cases
  }).fail(function() { /*allow exceptions*/ }).then(function(session) {
    var deferred = q.defer();

    //set timeout for the current script
    driver.manage().timeouts().setScriptTimeout(self.config_.timeout);

    //capture session id and setup globals
    if (self.driverprovider_.setSession) {
      self.driverprovider_.setSession(session);
    }

    self.setupGlobals_.bind(self)(driver);
    self.setupChromeDriver_();

    // Do the framework setup here so that jasmine and mocha globals are
    // available to the onPrepare function.
    if (self.config_.framework === 'jasmine') {
      self.runJasmine_.bind(self)(specs, function(runner){
        driver.quit().then(function() {
          deferred.resolve(runner);
        });
      });
    } else if (self.config_.framework === 'mocha') {
      self.runMocha_.bind(self)(specs, function(resolvedObj) {
        deferred.resolve(resolvedObj);
      });
    } else if (self.config_.framework === 'cucumber') {
      self.runCucumber_.bind(self)(specs, function(resolvedObj) {
        deferred.resolve(resolvedObj);
      });
    } else {
      throw new Error('config.framework ' + self.config_.framework +
          ' is not a valid framework.');
    }
    
    return deferred.promise;

  //3) Teardown
  }).fail(function() { /*allow exceptions*/ }).then(function(result) {
    return this.driverprovider_.teardownEnv(result);
  //4) Exit process
  }).fail(function() { /*allow exceptions*/ }).then(function(exitCode) {
    this.exit_(exitCode);
  });
};

/**
 * Creates and returns a TestRunner instance
 *
 * @public
 * @param {Object} config
 */
module.exports = (function(config) {
  return new TestRunner(config);
});
