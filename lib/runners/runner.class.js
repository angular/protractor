var protractor = require('../protractor.js'),
  webdriver = require('selenium-webdriver'),
  path = require('path'),
  fs = require('fs'),
  q = require('q');

/*
 * This is an abstract class serving as a basis for various test runner types.
 * The primary goal of this class is to allow for consistency and simplicity 
 *    in implementing test runner 'types', with functions like 
 *    self-configuration, validation, and execution in large part being
 *    abstracted here.
 */
function AbstractTestRunner() {


  /* Property Definitions BEGIN */

  //expected minimum contracts of implementing classes
  this._setupEnv = undefined;
  this._teardownEnv = undefined;
  this.getDriver = undefined;

  //abstract class default configuration
  this._config = {
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
  this._preparers = [];
  this._cleaners = [];
  this._driver = undefined;
  this._sessionId = undefined;
  this._server = undefined;
  this._sauceServer = undefined;


  //this allows for ease of maintaining public apis of the config while still
  //  allowing for easy variable renames or future config api changes while
  //  supported backwards compatibility
  this._configMap = {

    //structure is internal name -> supported config apis
    'specs': ['specs'],
    'capabilities': ['capabilities'],
    'seleniumHost': ['seleniumAddress'],
    'rootElement': ['rootElement'],
    'baseUrl': ['baseUrl'],
    'timeout': ['allScriptsTimeout'],
    'browserParams': ['params'],
    'framework': ['framework'],
    'jasmineOpts': ['jasmineNodeOpts'],
    'mochaOpts': ['mochaOpts'],
    'seleniumLocal.jar': ['seleniumServerJar'],
    'seleniumLocal.args': ['seleniumArgs'],
    'seleniumLocal.port': ['seleniumPort'],
    'sauceAccount.user': ['sauceUser'],
    'sauceAccount.key': ['sauceKey'],
    'chromeDriver': ['chromeDriver'],
    'configDir': ['configDir']
  };
  /* Property Definitions END */



  /**
   * Validate subclasses extending from abstract class testRunner()
   * @private   
   */
  this._validateContract = function() {
    var errPrepend = 'Invalid Contract for testRunner class: ';

    ['_setupEnv','_teardownEnv','getDriver'].forEach(function(fn) {
      if(!this[fn] && typeof(this[fn]) !== 'function') {
        throw new Error(errPrepend+' Function: '+fn+'() is not implemented!');
      }
    }, this);
  };


  /**
   * Sets up convenience globals for test specs
   * @private   
   */
  this._setupGlobals = function() {
    var globalEnv = {},
      browser = protractor.wrapDriver(
        this._driver,
        this._config.baseUrl,
        this._config.rootElement);

    browser.params = this._config.browserParams;
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
   * Sets up chromeDriver property.  Attempts to locate a default 
   * if none is provided
   * @private   
   */
  this._setupChromeDriver = function() {
    var defaultChromedriver,
      userSpecified = !!(this._config.chromeDriver);

    //use default if none was provided
    defaultChromedriver = (this._config.chromeDriver) ?
      this._config.chromeDriver : path.resolve(__dirname,
        '../../selenium/chromedriver');

    //check if file exists, if not try .exe or fail accordingly
    if(!fs.existsSync(defaultChromedriver)) {
      
      defaultChromedriver+='.exe';
      //throw error if the client specified conf chromedriver and its not found
      if(!fs.existsSync(defaultChromedriver) && userSpecified) {
        throw new Error('Could not find chromedriver at ' +
          defaultChromedriver);
      }
    }
    this._config.chromeDriver = defaultChromedriver;
  };


  /**
   * Responsible for executing the testRunner's test cases through Jasmine
   * @private   
   * @param {Array} specs - Array of Directory Path Strings
   * @param deferred - the deferred object that we're going to resolve when
   *    Jasmine is done
   */
  this._runJasmine = function(specs, deferred) {
    //jasmine setup
    var minijn = require('minijasminenode'),
      self = this;
    require('../../jasminewd');

    //inject on complete within flow and handle jasmine execution
    webdriver.promise.controlFlow().execute(function() {
      self._runTestPreparers();
    }).then(function() {
      var opt = self._config.jasmineOpts;
      opt._originalOnComplete = self._config.onComplete;
      opt.onComplete = function(runner, log) {
        if (opt._originalOnComplete) {
          opt._originalOnComplete(runner, log);
        }
        self.getDriver().quit().then(function() {
          deferred.resolve(runner);
        });
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
  this._runMocha = function(specs, deferred) {

    var Mocha = require('mocha'),
      mocha = new Mocha(this._config.mochaOpts),
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
      self._runTestPreparers();
    }).then(function() {

      specs.forEach(function(file) {
        mocha.addFile(file);
      });

      mocha.run(function(failures) {
        if (self._config.onComplete) {
          self._config.onComplete();
        }
        var resolvedObj = {
          results: function() {
            return {
              failedCount: failures
            };
          }
        };

        self.getDriver().quit().then(function() {
          deferred.resolve(resolvedObj);
        });
      });
    });
  };


  /**
   * Internal helper for abstraction of polymorphic filenameOrFn properties
   * @private   
   * @param {Array} source - the Object Array that we'll be iterating through
   *  as we evaluate whether to require or execute each item.
   */
  this._runFilenameOrFn = function(source) {
    var i, filenameOrFn;
    for(i=0; i<source.length; i++) {
      filenameOrFn = source[i];
      if (typeof filenameOrFn === 'function') {
        filenameOrFn();
      } else if (typeof filenameOrFn === 'string') {
        require(path.resolve(this._config.configDir, filenameOrFn));
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
  this.registerTestPreparer = function(filenameOrFn) {
    this._preparers.push(filenameOrFn);
  };


  /**
   * Executor of testPreparers
   * @private   
   */
  this._runTestPreparers = function() {
    this._runFilenameOrFn(this._preparers);
  };


  /**
   * Registrar for testCleaners - executed right after tests run.
   * @public
   * @param {string/Fn} filenameOrFn
   */
  this.registerTestCleaners = function(filenameOrFn) {
    this._cleaners.push(filenameOrFn);
  };


  /**
   * Executor of testCleaners
   * @private   
   */
  this._runTestCleaners = function() {
    this._runFilenameOrFn(this._cleaners);
  };


  /**
   * Merges in passed in configuration data with existing class defaults
   * @public 
   * @param {Object} config - A set of properties collected that will be merged
   *  with AbstractTestRunner defaults
   */
  this.loadConfig = function(config) {

    if(!config) {
      return;
    }

    /* helper to retrieve the correct value for string dot notation */
    function _setConfig(obj, str, val) {
      str = str.split('.');
      while (str.length > 1) {
        obj = obj[str.shift()];
      }
      obj[str.shift()] = val;
    }

    //object definition driven merging
    var key,configDef,configAlias,i;
    for(key in this._configMap) {

      configDef = this._configMap[key];
      for(i=0; i<configDef.length; i++) {
        configAlias = configDef[i];
        if( config[configAlias] !== null &&
          config[configAlias] !== '' &&
          config[configAlias] !== undefined &&
          !(config[configAlias] instanceof Array &&
              !config[configAlias].length) &&
          !(config[configAlias] instanceof Object &&
            !Object.keys(config[configAlias]).length)
        ) {
          //override config default w/ passed in config
          _setConfig(this._config,key,config[configAlias]);
        }
      }
    }
  };


  /**
   * Responsible for cleaning up test run and exiting the process.
   * @public
   * @param {int} Standard unix exit code - 1/0
   */
  this.exit = function(exitCode) {
    if (typeof config.onCleanUp === 'function') {
      config.onCleanUp(exitCode);
    }
    process.exit(exitCode);
  };

  /**
   * The primary workhorse interface.  Kicks off the test running process.
   * This method is responsible for setting up and tearing down the test
   *   environments as well as kicking of child test processes as necessary.
   * @public
   * @param {Array} specs
   */
  this.run = function(specs) {

    var self = this;

    //1) setup environment
    this._setupEnv().then(function() {
      self.getDriver();
      return self._driver.getSession();

    //2) execute test cases
    }).then(function(session) {

      var deferred = q.defer();

      //set timeout for the current script
      self._driver.manage().timeouts().setScriptTimeout(self._config.timeout);

      //capture session id and setup globals
      self._sessionId = session.getId();
      self._setupGlobals.bind(self)();
      self._setupChromeDriver();

      // Do the framework setup here so that jasmine and mocha globals are
      // available to the onPrepare function.
      if (self._config.framework === 'jasmine') {
        self._runJasmine.bind(self)(specs, deferred);
      } else if (self._config.framework === 'mocha') {
        self._runMocha.bind(self)(specs, deferred);
      } else {
        throw new Error('config.framework ' + self._config.framework +
          ' is not a valid framework.');
      }

      return deferred.promise;

    //3) cleanup
    }).then(function(result) {
      return self._teardownEnv(result);
    });
  };

  /* Method Definitions END */
}




/**
 * Creates and validates an instance, given a SubClass definition
 *
 * @public 
 * @param {Object} subClass
 * @param {Array} SubClassArgs
 */
exports.init = function(SubClass,SubClassArgs) {

  //setup new object + inherit
  SubClass.prototype = new AbstractTestRunner();
  var sub = new SubClass(SubClassArgs);

  //validate
  sub._validateContract();
  if(sub.validate) {
    sub.validate();
  }

  return sub;
};
