/*
 *  This is an implementation of the Sauce Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *    it down, and setting up the driver correctly.
 */

var util = require('util'),
    webdriver = require('selenium-webdriver'),
    SauceLabs = require('saucelabs');
    q = require('q');


function SauceDriverProvider(testRunner) {

  this.testRunner_ = testRunner;
  this.trConfig_ = this.testRunner_.getConfig();
  this.sauceServer_ = {};
  this.sessionId_ = null;
  this.driver_ = null;
}


/**
 * Setter for session
 * @public
 */
SauceDriverProvider.prototype.setSession = function(session) {
  this.sessionId_ = session.getId();
};

/**
 * setupEnv is responsible for configuring and launching (if applicable)
 * the object's environment.
 * @public
 */
SauceDriverProvider.prototype.setupEnv = function() {
  var deferred = q.defer();
  this.sauceServer_ = new SauceLabs({
    username: this.trConfig_.sauceAccount.user,
    password: this.trConfig_.sauceAccount.key
  });
  this.trConfig_.capabilities.username = this.trConfig_.sauceAccount.user;
  this.trConfig_.capabilities.accessKey = this.trConfig_.sauceAccount.key;
  this.trConfig_.seleniumHost = 'http://' + this.trConfig_.sauceAccount.user + ':' +
      this.trConfig_.sauceAccount.key + '@ondemand.saucelabs.com:80/wd/hub';

  util.puts('Using SauceLabs selenium server at ' +
      this.trConfig_.seleniumHost);
  deferred.resolve(this.trConfig_.seleniumHost);
  return deferred.promise;
};

/**
 * teardownEnv is responsible for destroying the environment and doing any
 * associated cleanup.
 * @public
 * @param {runnerResult} runner 
 * @return promise
 */
SauceDriverProvider.prototype.teardownEnv = function(runner) {
  var deferred = q.defer(),
      passed = runner.results().failedCount === 0,
      exitCode = passed ? 0 : 1;

  this.sauceServer_.updateJob(this.sessionId_, {'passed': passed}, function(err) {
    if (err) {
      throw new Error(
        'Error updating Sauce pass/fail status: ' + util.inspect(err)
      );
    }
    deferred.resolve(exitCode);
  });
  return deferred.promise;
};

/**
 * getDriver is responsible for retrieving the webdriver for the runner.
 * @public
 * @return webdriver instance   
 */
SauceDriverProvider.prototype.getDriver = function() {
  if (!this.driver_) {
    this.driver_ = new webdriver.Builder().
    usingServer(this.trConfig_.seleniumHost).
    withCapabilities(this.trConfig_.capabilities).build();
  }
  return this.driver_;
};

//new instance w/ each include
module.exports = (function(testRunner) {
  return new SauceDriverProvider(testRunner);
});
