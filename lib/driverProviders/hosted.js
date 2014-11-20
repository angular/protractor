/*
 *  This is an implementation of the Hosted Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */

var util = require('util'),
    webdriver = require('selenium-webdriver'),
    q = require('q');

var HostedDriverProvider = function(config) {
  this.config_ = config;
  this.drivers_ = null;
};

/**
 * Configure and launch (if applicable) the object's environment.
 * @public
 * @return {q.promise} A promise which will resolve when the environment is
 *     ready to test.
 */
HostedDriverProvider.prototype.setupEnv = function() {
  var config = this.config_,
      seleniumAddress = config.seleniumAddress;

  if (q.isPromiseAlike(seleniumAddress)) {
    return q.when(seleniumAddress).then(function(resolvedAddress) {
      config.seleniumAddress = resolvedAddress;
      util.puts('Using the selenium server at ' + config.seleniumAddress);
    });
  } else {
    util.puts('Using the selenium server at ' + this.config_.seleniumAddress);
    return q.fcall(function() {});
  }
};

/**
 * Teardown and destroy the environment and do any associated cleanup.
 * Shuts down the drivers.
 *
 * @public
 * @return {q.promise} A promise which will resolve when the environment
 *     is down.
 */
HostedDriverProvider.prototype.teardownEnv = function() {
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
HostedDriverProvider.prototype.getDrivers = function() {
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
  return new HostedDriverProvider(config);
};
