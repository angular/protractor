/**
 *  This is a base driver provider class.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */

var webdriver = require('selenium-webdriver'),
    q = require('q');

var DriverProvider = function(config) {
  this.config_ = config;
  this.drivers_ = [];
};

/**
 * Teardown and destroy the environment and do any associated cleanup.
 * Shuts down the drivers.
 *
 * @public
 * @return {q.promise} A promise which will resolve when the environment
 *     is down.
 */
DriverProvider.prototype.teardownEnv = function() {
  var deferredArray = this.drivers_.map(function(driver) {
    var deferred = q.defer();
    driver.getSession().then(function(session_) {
      if (session_) {
        driver.quit().then(function() {
          deferred.resolve();
        });
      } else {
        deferred.resolve();
      }
    });
    return deferred.promise;
  });
  return q.all(deferredArray);
};

/**
 * Create a new driver.
 *
 * @public
 * @return webdriver instance
 */
DriverProvider.prototype.getNewDriver = function() {
  var newDriver = new webdriver.Builder().
      usingServer(this.config_.seleniumAddress).
      withCapabilities(this.config_.capabilities).
      build();
  this.drivers_.push(newDriver);
  return newDriver;
};

module.exports = DriverProvider;
