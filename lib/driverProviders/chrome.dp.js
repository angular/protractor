/*
 *  This is an implementation of the Chrome Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */

var util = require('util'),
    webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    q = require('q'),
    fs = require('fs'),
    path = require('path');

var ChromeDriverProvider = function(config) {
  this.config_ = config;
  this.driver_ = null;
};

/**
 * Configure and launch (if applicable) the object's environment.
 * @public
 * @return {q.promise} A promise which will resolve when the environment is
 *     ready to test.
 */
ChromeDriverProvider.prototype.setupEnv = function() {
  util.puts('Using ChromeDriver directly...');
  return q.fcall(function() {});
};

/**
 * Teardown and destroy the environment and do any associated cleanup.
 * Shuts down the driver.
 *
 * @public
 * @return {q.promise} A promise which will resolve when the environment
 *     is down.
 */
ChromeDriverProvider.prototype.teardownEnv = function() {
  var deferred = q.defer();
  this.driver_.quit().then(function() {
    deferred.resolve();
  });
  return deferred.promise;
};

/**
 * Retrieve the webdriver for the runner.
 * @public
 * @return webdriver instance
 */
ChromeDriverProvider.prototype.getDriver = function() {
  if (!this.driver_) {
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
    this.driver_ = chrome.createDriver(
        new webdriver.Capabilities(this.config_.capabilities), service);
  }
  return this.driver_;
};

// new instance w/ each include
module.exports = (function(config) {
  return new ChromeDriverProvider(config);
});
