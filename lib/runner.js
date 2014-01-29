'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var chrome = require('selenium-webdriver/chrome');
var protractor = require('./protractor.js');
var SauceLabs = require('saucelabs');
var glob = require('glob');

var server;
var driver;
var sessionId;
var sauceAccount;

// Default configuration.
var config = {
  configDir: './',
  seleniumServerJar: null,
  seleniumArgs: [],
  seleniumPort: null,
  seleniumAddress: null,
  allScriptsTimeout: 11000,
  capabilities: {
    'browserName': 'chrome'
  },
  rootElement: 'body',
  params: {},
  framework: 'jasmine',
  jasmineNodeOpts: {
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    stackFilter: protractor.filterStackTrace
  },
  mochaOpts: {
    ui: 'bdd',
    reporter: 'list'
  }
};

/**
 * Merge config objects together.
 *
 * @param {Object} into
 * @param {Object} from
 *
 * @return {Object} The 'into' config.
 */
var merge = function(into, from) {
  for (var key in from) {
    if (into[key] instanceof Object && !(into[key] instanceof Array)) {
      merge(into[key], from[key]);
    } else {
      into[key] = from[key];
    }
  }
  return into;
};

/**
 * Add the options in the parameter config to this runner instance.
 *
 * @param {Object} additionalConfig
 */
var addConfig = function(additionalConfig) {
  // All filepaths should be kept relative to the current config location.
  // This will not affect absolute paths.
  ['seleniumServerJar', 'chromeDriver', 'onPrepare'].forEach(function(name) {
    if (additionalConfig[name] && additionalConfig.configDir &&
        typeof additionalConfig[name] === 'string') {
      additionalConfig[name] =
          path.resolve(additionalConfig.configDir, additionalConfig[name]);
    }
  })
  merge(config, additionalConfig);
};

/**
 * Cleanup the driver and server after running tests.
 *
 * @param runner The Jasmine runner object.
 */
var cleanUp = function(runner) {
  var passed = runner.results().failedCount === 0;
  var exitCode = passed ? 0 : 1;
  var exit = function(exitCode) {
    if (typeof config.onCleanUp === 'function') {
      config.onCleanUp(exitCode);
    }
    process.exit(exitCode);
  };
  if (sauceAccount) {
    sauceAccount.updateJob(sessionId, {'passed': passed}, function(err) {
      if (err) {
        throw new Error(
          'Error updating Sauce pass/fail status: ' + util.inspect(err)
        );
      }
      exit(exitCode);
    });
  } else if (server) {
    util.puts('Shutting down selenium standalone server.');
    server.stop().then(function() {
      exit(exitCode);
    });
  } else {
    exit(exitCode);
  }
};


/**
 * Sets up the Selenium server and returns a promise once the server is
 * ready to go. After this function is called, config.seleniumAddress
 * and config.capabilities are set up.
 *
 * @return {webdriver.promise.Promise.<string>} A promise which resolves to
 *     the value of the selenium address that will be used.
 */
var setUpSelenium = function() {
  // TODO: This should not be tied to the webdriver promise loop, it should use
  // another promise system instead.
  var deferred = webdriver.promise.defer();

  if (config.sauceUser && config.sauceKey) {
    sauceAccount = new SauceLabs({
      username: config.sauceUser,
      password: config.sauceKey
    });
  }

  var defaultChromedriver;
  if (config.chromeDriver) {
    if (!fs.existsSync(config.chromeDriver)) {
      if (fs.existsSync(config.chromeDriver + '.exe')) {
        config.chromeDriver += '.exe';
      } else {
        throw 'Could not find chromedriver at ' + config.chromeDriver;
      }
    }
  } else {
    defaultChromedriver = path.resolve(
        __dirname,
        '../selenium/chromedriver');
    if (fs.existsSync(defaultChromedriver)) {
      config.chromeDriver = defaultChromedriver;
    } else if (fs.existsSync(defaultChromedriver + '.exe')) {
      config.chromeDriver = defaultChromedriver + '.exe';
    }
  }

  // Priority
  // 1) if chromeOnly, use that
  // 2) if seleniumAddress is given, use that
  // 3) if a sauceAccount is given, use that.
  // 4) if a seleniumServerJar is specified, use that
  // 5) try to find the seleniumServerJar in protractor/selenium
  if (config.chromeOnly) {
    util.puts('Using ChromeDriver directly...');
    deferred.fulfill(null);
  } else if (config.seleniumAddress) {
    util.puts('Using the selenium server at ' + config.seleniumAddress);
    deferred.fulfill(config.seleniumAddress);
  } else if (sauceAccount) {
    config.capabilities.username = config.sauceUser;
    config.capabilities.accessKey = config.sauceKey;
    if (!config.jasmineNodeOpts.defaultTimeoutInterval) {
      config.jasmineNodeOpts.defaultTimeoutInterval = 30 * 1000;
    }
    config.seleniumAddress = 'http://' + config.sauceUser + ':' +
        config.sauceKey + '@ondemand.saucelabs.com:80/wd/hub';

    util.puts('Using SauceLabs selenium server at ' + config.seleniumAddress);
    deferred.fulfill(config.seleniumAddress);
  } else {
    util.puts('Starting selenium standalone server...');

    if (!config.seleniumServerJar) {
      // Try to use the default location.
      var defaultStandalone = path.resolve(__dirname,
          '../selenium/selenium-server-standalone-' +
          require('../package.json').webdriverVersions.selenium + '.jar');
      if (!fs.existsSync(defaultStandalone)) {
        throw new Error('Unable to start selenium. ' +
        'You must specify either a seleniumAddress, ' +
        'seleniumServerJar, or saucelabs account, or use webdriver-manager.');
      } else {
        config.seleniumServerJar = defaultStandalone;
      }
    } else if (!fs.existsSync(config.seleniumServerJar)) {
      throw new Error('there\'s no selenium server jar at the specified ' +
        'location. Do you have the correct version?');
    }

    if (config.chromeDriver) {
      config.seleniumArgs.push(
          '-Dwebdriver.chrome.driver=' + config.chromeDriver);
    }

    server = new remote.SeleniumServer(config.seleniumServerJar, {
      args: config.seleniumArgs,
      port: config.seleniumPort
    });

    server.start().then(function(url) {
      util.puts('Selenium standalone server started at ' + url);
      config.seleniumAddress = server.address();
      deferred.fulfill(config.seleniumAddress);
    });
  }

  return deferred.promise;
};


/**
 * Resolve a list of file patterns into a list of individual file paths.
 *
 * @param {array} patterns
 * @param {boolean} opt_omitWarnings  whether to omit did not match warnings
 *
 * @return {array} The resolved file paths.
 */
var resolveFilePatterns = function(patterns, opt_omitWarnings) {
  var resolvedFiles = [];

  if (patterns) {
    for (var i = 0; i < patterns.length; ++i) {
      var matches = glob.sync(patterns[i], {cwd: config.configDir});
      if (!matches.length && !opt_omitWarnings) {
        util.puts('Warning: pattern ' + patterns[i] + ' did not match any files.');
      }
      for (var j = 0; j < matches.length; ++j) {
        resolvedFiles.push(path.resolve(config.configDir, matches[j]));
      }
    }
  }
  return resolvedFiles;
};

/**
 * Set up webdriver and run the tests. Note that due to the current setup of
 * loading Jasmine and the test specs, this should only be run once.
 *
 * @return {webdriver.promise.Promise} A promise that will resolve
 *     when the test run is finished.
 */
var runTests = function() {
  if (config.jasmineNodeOpts.specFolders) {
    throw new Error('Using config.jasmineNodeOpts.specFolders is deprecated ' +
        'since Protractor 0.6.0. Please switch to config.specs.');
  }

  var resolvedExcludes = resolveFilePatterns(config.exclude, true);
  var resolvedSpecs = resolveFilePatterns(config.specs).filter(function (path) {
    return resolvedExcludes.indexOf(path) < 0;
  });

  if (!resolvedSpecs.length) {
    throw new Error('Spec patterns did not match any files.');
  }

  // TODO: This should not be tied to the webdriver promise loop, it should use
  // another promise system instead.
  var runDeferred = webdriver.promise.defer();

  if (config.chromeOnly) {
    var service = new chrome.ServiceBuilder(config.chromeDriver).build();
    driver = chrome.createDriver(
        new webdriver.Capabilities(config.capabilities), service);
  } else {
    driver = new webdriver.Builder().
        usingServer(config.seleniumAddress).
        withCapabilities(config.capabilities).build();
  }

  driver.getSession().then(function(session) {
    driver.manage().timeouts().setScriptTimeout(config.allScriptsTimeout);

    sessionId = session.getId();

    var browser = protractor.wrapDriver(
        driver,
        config.baseUrl,
        config.rootElement);
    browser.params = config.params;

    protractor.setInstance(browser);

    // Export protractor to the global namespace to be used in tests.
    global.protractor = protractor;
    global.browser = browser;
    global.$ = browser.$;
    global.$$ = browser.$$;
    global.element = browser.element;
    global.by = global.By = protractor.By;

    // Do the framework setup here so that jasmine and mocha globals are
    // available to the onPrepare function.
    var minijn, mocha;
    if (config.framework === 'jasmine') {
      minijn = require('minijasminenode');
      require('../jasminewd');
      minijn.addSpecs(resolvedSpecs);
    } else if (config.framework === 'mocha') {
      var Mocha = require('mocha');

      mocha = new Mocha(config.mochaOpts);

      resolvedSpecs.forEach(function(file) {
        mocha.addFile(file);
      });

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
    } else {
      throw 'config.framework ' + config.framework +
          ' is not a valid framework.';
    }

    // Let the configuration configure the protractor instance before running
    // the tests.
    webdriver.promise.controlFlow().execute(function() {
      if (config.onPrepare) {
        if (typeof config.onPrepare === 'function') {
          config.onPrepare();
        } else if (typeof config.onPrepare === 'string') {
          require(path.resolve(config.configDir, config.onPrepare));
        } else {
          throw 'config.onPrepare must be a string or function';
        }
      }
    }).then(function() {
      var options = config.jasmineNodeOpts;
      var originalOnComplete = options.onComplete;
      options.onComplete = function(runner, log) {
        if (originalOnComplete) {
          originalOnComplete(runner, log);
        }
        driver.quit().then(function() {
          runDeferred.fulfill(runner);
        });
      };

      if (config.framework === 'jasmine') {
        minijn.executeSpecs(options);
      } else if (config.framework === 'mocha') {
        mocha.run(function(failures) {
          // Warning: hack to make it have the same signature as Jasmine 1.3.1.
          if (originalOnComplete) {
            originalOnComplete();
          }
          driver.quit().then(function() {
            runDeferred.fulfill({
              results: function() {
                return {
                  failedCount: failures
                };
              }
            });
          });
        });
      }
    });
  });

  return runDeferred.promise;
};


/**
 * Run Protractor once.
 */
var runOnce = function() {
  var specs = config.specs;
  if (!specs || specs.length === 0) {
    util.puts('No spec files found');
    process.exit(0);
  }

  return setUpSelenium().then(function() {
    // cleanUp must be registered directly onto runTests, not onto
    // the chained promise, so that cleanUp is still called in case of a
    // timeout error. Timeout errors need to clear the control flow, which
    // would mess up chaining promises.
    return runTests().then(cleanUp);
  });
};

exports.addConfig = addConfig;
exports.runOnce = runOnce;
