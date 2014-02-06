/*
 *  This is an implementation of the Hosted Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *    it down, and setting up the driver correctly.
 */

var util = require('util'),
    webdriver = require('selenium-webdriver'),
    q = require('q');


function HostedDriverProvider(testRunner) {

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
HostedDriverProvider.prototype.setupEnv = function() {
  var deferred = q.defer();
  util.puts('Using the selenium server at ' + this.trConfig_.seleniumHost);
  deferred.resolve(this.trConfig_.seleniumHost);
  return deferred.promise;
};

/**
 * teardownEnv is responsible for destroying the environment and doing any
 * associated cleanup.
 * @public
 * @param {runnerResult} runner 
 */
HostedDriverProvider.prototype.teardownEnv = function(runner) {
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
HostedDriverProvider.prototype.getDriver = function() {
  if (!this.driver_) {
    this.driver_ = new webdriver.Builder().
    usingServer(this.trConfig_.seleniumHost).
    withCapabilities(this.trConfig_.capabilities).build();
  }
  return this.driver_;
};

//new instance w/ each include
module.exports = (function(testRunner) {
  return new HostedDriverProvider(testRunner);
});
