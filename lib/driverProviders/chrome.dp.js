/*
 *  This is an implementation of the Chrome Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *    it down, and setting up the driver correctly.
 */

var util = require('util'),
    webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    q = require('q');

function ChromeDriverProvider(testRunner) {

  this.testRunner_ = testRunner;
  this.trConfig_ = this.testRunner_.getConfig();
  this.driver_ = null;
}

/**
 * setupEnv is responsible for configuring and launching (if applicable)
 * the object's environment.
 * @public
 * @return promise
 */
ChromeDriverProvider.prototype.setupEnv = function() {
  var deferred = q.defer();
  util.puts('Using ChromeDriver directly...');
  deferred.resolve();
  return deferred.promise;
};

/**
 * teardownEnv is responsible for destroying the environment and doing any
 * associated cleanup.
 * @public
 * @param {runnerResult} runner 
 */
ChromeDriverProvider.prototype.teardownEnv = function(runner) {
  var deferred = q.defer(),
      passed = runner.results().failedCount === 0,
      exitCode = passed ? 0 : 1;

  deferred.resolve(exitCode);
  return deferred.promise;
};

/**
 * getDriver is responsible for retrieving the webdriver for the runner.
 * @public
 * @return webdriver instance
 */
ChromeDriverProvider.prototype.getDriver = function() {
  if (!this.driver_) {
    var service = new chrome.ServiceBuilder(this.trConfig_.chromeDriver).build();
    this.driver_ = chrome.createDriver(
    new webdriver.Capabilities(this.trConfig_.capabilities), service);
  }
  return this.driver_;
};

//new instance w/ each include
module.exports = (function(testRunner) {
  return new ChromeDriverProvider(testRunner);
});