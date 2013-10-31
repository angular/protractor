var util = require('util');
var path = require('path')
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var minijn = require('minijasminenode');
var protractor = require('./protractor.js');
var SauceLabs = require('saucelabs');
var glob = require('glob');
require('../jasminewd')

var server;
var driver;
var sessionId;
var sauceAccount;

// Default configuration.
var config = {
  specFileBase: './',
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
  jasmineNodeOpts: {
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
}

/**
 * Merge config objects together.
 *
 * @param {Object} into
 * @param {Object} from
 *
 * @return {Object} The 'into' config.
 */
var merge = function(into, from) {
  for (key in from) {
    if (into[key] instanceof Object) {
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
  merge(config, additionalConfig);
};

/**
 * Cleanup the driver and server after running tests.
 *
 * @param runner The Jasmine runner object.
 */
var cleanUp = function(runner) {
  var passed = runner.results().failedCount == 0;
  var exitCode = passed ? 0 : 1;
  if (sauceAccount) {
    sauceAccount.updateJob(sessionId, {'passed': passed}, function(err) {
      if (err) {
        throw new Error(
          "Error updating Sauce pass/fail status: " + util.inspect(err)
        );
      }
      process.exit(exitCode);
    });
  } else if (server) {
    util.puts('Shutting down selenium standalone server.');
    server.stop().then(function() {
      process.exit(exitCode);
    });
  } else {
    process.exit(exitCode);
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
  var promise = webdriver.promise.defer();

  if (config.sauceUser && config.sauceKey) {
    sauceAccount = new SauceLabs({
      username: config.sauceUser,
      password: config.sauceKey
    });
  }

  if (config.seleniumAddress) {
    util.puts('Using the selenium server at ' + config.seleniumAddress);
    promise.fulfill(config.seleniumAddress);
  } else if (sauceAccount) {
    config.capabilities.username = config.sauceUser;
    config.capabilities.accessKey = config.sauceKey;
    if (!config.jasmineNodeOpts.defaultTimeoutInterval) {
      config.jasmineNodeOpts.defaultTimeoutInterval = 30 * 1000;
    }
    config.seleniumAddress = 'http://' + config.sauceUser + ':' +
        config.sauceKey + '@ondemand.saucelabs.com:80/wd/hub';

    util.puts('Using SauceLabs selenium server at ' + config.seleniumAddress);
    promise.fulfill(config.seleniumAddress);
  } else if (config.seleniumServerJar) {
    util.puts('Starting selenium standalone server...');
    if (config.chromeDriver) {
      if (!fs.existsSync(config.chromeDriver)) {
        if (fs.existsSync(config.chromeDriver + '.exe')) {
          config.chromeDriver += '.exe';
        } else {
          throw 'Could not find chromedriver at ' + config.chromeDriver;
        }
      }
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
      promise.fulfill(config.seleniumAddress);
    });
  } else {
    throw new Error('You must specify either a seleniumAddress, ' +
        'seleniumServerJar, or saucelabs account.');
  }

  return promise;
}

/**
 * Set up webdriver and run the tests. Note that due to the current setup of
 * loading Jasmine and the test specs, this should only be run once.
 *
 * @return {webdriver.promise.Promise} A promise that will resolve
 *     when the test run is finished.
 */
var runJasmineTests = function() {
  if (config.jasmineNodeOpts.specFolders) {
    throw new Error('Using config.jasmineNodeOpts.specFolders is deprecated ' +
        'since Protractor 0.6.0. Please switch to config.specs.');
  }
  var specs = config.specs;
  if (!specs || specs.length == 0) {
    throw new Error('No spec files found.');
  }
  var resolvedSpecs = [];
  for (var i = 0; i < specs.length; ++i) {
    var matches = glob.sync(specs[i], {cwd: config.specFileBase});
    if (!matches.length) {
      throw new Error('Test file ' + specs[i] + ' did not match any files.');
    }
    for (var j = 0; j < matches.length; ++j) {
      resolvedSpecs.push(path.resolve(config.specFileBase, matches[j]));
    }
  }

  minijn.addSpecs(resolvedSpecs);
  var runPromise = webdriver.promise.defer();
  driver = new webdriver.Builder().
      usingServer(config.seleniumAddress).
      withCapabilities(config.capabilities).build();

  driver.getSession().then(function(session) {
    driver.manage().timeouts().setScriptTimeout(config.allScriptsTimeout);

    sessionId = session.getId();

    var browser = protractor.wrapDriver(
        driver,
        config.baseUrl,
        config.rootElement)
    browser.params = config.params;

    protractor.setInstance(browser);

    // Export protractor to the global namespace to be used in tests.
    global.protractor = protractor;
    global.browser = browser;
    global.$ = browser.$;
    global.$$ = browser.$$;
    global.element = browser.element;
    global.by = protractor.By;

    // Let the configuration configure the protractor instance before running
    // the tests.
    webdriver.promise.controlFlow().execute(function() {
      if (config.onPrepare) {
        if (typeof config.onPrepare == 'function') {
          config.onPrepare();
        } else if (typeof config.onPrepare == 'string') {
          require(path.resolve(config.specFileBase, config.onPrepare));
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
          runPromise.fulfill(runner);
        });
      };

      minijn.executeSpecs(options);
    });
  });

  return runPromise;
};


/**
 * Run Protractor once.
 */
var runOnce = function() {
  setUpSelenium().
      then(runJasmineTests).
      then(cleanUp);
};

exports.addConfig = addConfig;
exports.runOnce = runOnce;
