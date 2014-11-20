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
  this.drivers_ = null;
};


/**
 * Hook to update the sauce job.
 * @public
 * @param {Object} update
 * @return {q.promise} A promise that will resolve when the update is complete.
 */
SauceDriverProvider.prototype.updateJob = function(update) {
  
  var self = this;
  var deferredArray = this.drivers_.map(function(driver) {
    var deferred = q.defer();
    driver.getSession().then(function(session) {
      console.log('SauceLabs results available at http://saucelabs.com/jobs/' +
          session.getId());
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
  });
  return q.all(deferredArray);
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
  var auth = 'http://' + this.config_.sauceUser + ':' +
    this.config_.sauceKey + '@';
  this.config_.seleniumAddress = auth +
      (this.config_.sauceSeleniumAddress ? this.config_.sauceSeleniumAddress :
      'ondemand.saucelabs.com:80/wd/hub');
  
  // Append filename to capabilities.name so that it's easier to identify tests.
  if (this.config_.capabilities.name &&
      this.config_.capabilities.shardTestFiles) {
    this.config_.capabilities.name += (
        ':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
  }

  util.puts('Using SauceLabs selenium server at ' +
      this.config_.seleniumAddress.replace(/\/\/.+@/, '//'));
  deferred.resolve();
  return deferred.promise;
};

/**
 * Teardown and destroy the environment and do any associated cleanup.
 * Shuts down the drivers.
 *
 * @public
 * @return {q.promise} A promise which will resolve when the environment
 *     is down.
 */
SauceDriverProvider.prototype.teardownEnv = function() {
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
 * Retrieve the array of webdrivers for the runner.
 * The count is specified in config.numDrivers
 * @public
 * @return Array<webdriver.WebDriver> 
 */
SauceDriverProvider.prototype.getDrivers = function() {
  if (!this.drivers_) {
    this.drivers_ = [];
    for (var i = 0; i < this.config_.numDrivers; ++i) {
      var newDriver = new webdriver.Builder().
          usingServer(this.config_.seleniumAddress).
          withCapabilities(this.config_.capabilities).
          build();
      this.drivers_.push(newDriver);
    }
  }
  return this.drivers_;
};

// new instance w/ each include
module.exports = function(config) {
  return new SauceDriverProvider(config);
};
