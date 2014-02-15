/*
 * This is an implementation of the SauceLabs Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */

var util = require('util'),
    webdriver = require('selenium-webdriver'),
    SauceLabs = require('saucelabs'),
    q = require('q');


var SauceDriverProvider = function(config) {
  this.config_ = config;
  this.sauceServer_ = {};
  this.driver_ = null;
};


/**
 * Hook to update the sauce job.
 * @public
 * @param {Object} update
 * @return {q.promise} A promise that will resolve when the update is complete.
 */
SauceDriverProvider.prototype.updateJob = function(update) {
  var deferred = q.defer();
  var self = this;
  this.driver_.getSession().then(function(session) {
    self.sauceServer_.updateJob(session.getId(), update, function(err) {
      if (err) {
        throw new Error(
          'Error updating Sauce pass/fail status: ' + util.inspect(err)
        );
      }
      deferred.resolve();
    });
  });
  return deferred.promise;
};

/**
 * Configure and launch (if applicable) the object's environment.
 * @public
 * @return {q.promise} A promise which will resolve when the environment is
 *     ready to test.
 */
SauceDriverProvider.prototype.setupEnv = function() {
  var deferred = q.defer();
  this.sauceServer_ = new SauceLabs({
    username: this.config_.sauceUser,
    password: this.config_.sauceKey
  });
  this.config_.capabilities.username = this.config_.sauceUser;
  this.config_.capabilities.accessKey = this.config_.sauceKey;
  this.config_.seleniumAddress = 'http://' + this.config_.sauceUser + ':' +
      this.config_.sauceKey + '@ondemand.saucelabs.com:80/wd/hub';

  util.puts('Using SauceLabs selenium server at ' +
      this.config_.seleniumAddress);
  deferred.resolve();
  return deferred.promise;
};

/**
 * Teardown and destroy the environment and do any associated cleanup.
 * Shuts down the driver.
 *
 * @public
 * @return {q.promise} A promise which will resolve when the environment
 *     is down.
 */
SauceDriverProvider.prototype.teardownEnv = function() {
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
SauceDriverProvider.prototype.getDriver = function() {
  if (!this.driver_) {
    this.driver_ = new webdriver.Builder().
        usingServer(this.config_.seleniumAddress).
        withCapabilities(this.config_.capabilities).build();
  }
  return this.driver_;
};

// new instance w/ each include
module.exports = (function(config) {
  return new SauceDriverProvider(config);
});
