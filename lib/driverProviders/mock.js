/*
 * This is an mock implementation of the Driver Provider.
 * It returns a fake webdriver and never actually contacts a selenium
 * server.
 */
var webdriver = require('selenium-webdriver'),
    util = require('util'),
    q = require('q'),
    DriverProvider = require('./driverProvider');
/**
 * @constructor
 */
var MockExecutor = function() {
};

/**
 * An execute function that returns a promise with a test value.
 */
MockExecutor.prototype.execute = function() {
  var deferred = q.defer();
  deferred.resolve({value: 'test_response'});
  return deferred.promise;
};

var MockDriverProvider = function(config) {
  DriverProvider.call(this, config);
};
util.inherits(MockDriverProvider, DriverProvider);


/**
 * Configure and launch (if applicable) the object's environment.
 * @public
 * @return {q.promise} A promise which will resolve immediately.
 */
MockDriverProvider.prototype.setupEnv = function() {
  return q.fcall(function() {});
};


/**
 * Create a new driver.
 *
 * @public
 * @override
 * @return webdriver instance
 */
MockDriverProvider.prototype.getNewDriver = function() {
  var mockSession = new webdriver.Session('test_session_id', {});
  var newDriver = new webdriver.WebDriver(mockSession, new MockExecutor());
  this.drivers_.push(newDriver);
  return newDriver;
};

// new instance w/ each include
module.exports = function(config) {
  return new MockDriverProvider(config);
};
