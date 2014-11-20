/*
 *  This is an implementation of the Direct Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */

var webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    firefox = require('selenium-webdriver/firefox'),
    q = require('q'),
    fs = require('fs'),
    path = require('path');

var DirectDriverProvider = function(config) {
  this.config_ = config;
  this.drivers_ = null;
};

/**
 * Configure and launch (if applicable) the object's environment.
 * @public
 * @return {q.promise} A promise which will resolve when the environment is
 *     ready to test.
 */
DirectDriverProvider.prototype.setupEnv = function() {
  switch (this.config_.capabilities.browserName) {
    case 'chrome':
      console.log('Using ChromeDriver directly...');
      break;
    case 'firefox':
      console.log('Using FirefoxDriver directly...');
      break;
    default:
      throw new Error('browserName (' + this.config_.capabilities.browserName +
          ') is not supported with directConnect.');
  }
  return q.fcall(function() {});
};

/**
 * Teardown and destroy the environment and do any associated cleanup.
 * Shuts down the drivers.
 *
 * @public
 * @return {q.promise} A promise which will resolve when the environment
 *     is down.
 */
DirectDriverProvider.prototype.teardownEnv = function() {
  var deferredArray = this.drivers_.map(function(driver) {
    var deferred = q.defer();
    driver.quit().then(function() {
      deferred.resolve();
    });
    return deferred.promise;
  });
  return q.all(deferredArray);
};

/**
 * Create a new driver.
 *
 * @private
 * @return webdriver instance
 */
DirectDriverProvider.prototype.newDriver_ = function() {
  var driver; 
  switch (this.config_.capabilities.browserName) {
    case 'chrome':
      var chromeDriverFile = this.config_.chromeDriver ||
          path.resolve(__dirname, '../../selenium/chromedriver');

      // Check if file exists, if not try .exe or fail accordingly
      if (!fs.existsSync(chromeDriverFile)) {
        chromeDriverFile += '.exe';
        // Throw error if the client specified conf chromedriver and its not found
        if (!fs.existsSync(chromeDriverFile)) {
          throw new Error('Could not find chromedriver at ' +
            chromeDriverFile);
        }
      }

      var service = new chrome.ServiceBuilder(chromeDriverFile).build();
      driver = chrome.createDriver(
          new webdriver.Capabilities(this.config_.capabilities), service); 
      break;
    case 'firefox':
      if (this.config_.firefoxPath) {
        this.config_.capabilities.firefox_binary = this.config_.firefoxPath;
      }
      driver = new firefox.Driver(this.config_.capabilities);
      break;
    default:
      throw new Error('browserName ' + this.config_.capabilities.browserName +
          'is not supported with directConnect.');
  }
  return driver;
};

/**
 * Retrieve the array of webdrivers for the runner.
 * The count is specified in config.numDrivers
 * @public
 * @return Array<webdriver.WebDriver>
 */
DirectDriverProvider.prototype.getDrivers = function() {
  if (this.drivers_) {
    return this.drivers_;
  }
  this.drivers_ = [];
  for (var i = 0; i < this.config_.numDrivers; ++i) {
    this.drivers_.push(this.newDriver_());
  }
  return this.drivers_;
};

// new instance w/ each include
module.exports = function(config) {
  return new DirectDriverProvider(config);
};
