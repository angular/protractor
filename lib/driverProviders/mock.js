/*
 * This is an mock implementation of the Driver Provider.
 * It returns a fake webdriver and never actually contacts a selenium
 * server.
 */
var webdriver = require('selenium-webdriver'),
    q = require('q');
/**
 * @constructor
 */
var MockExecutor = function() {
  this.drivers_ = null;
};

/**
 * @param {!webdriver.Command} command The command to execute.
 * @param {function(Error, !bot.response.ResponseObject=)} callback the function
 *     to invoke when the command response is ready.
 */
MockExecutor.prototype.execute = function(command, callback) {
  callback(null, {
    status: '0',
    value: 'test_response'
  });
};

var MockDriverProvider = function(config) {
  this.config_ = config;
};

/**
 * Configure and launch (if applicable) the object's environment.
 * @public
 * @return {q.promise} A promise which will resolve immediately.
 */
MockDriverProvider.prototype.setupEnv = function() {
  return q.fcall(function() {});
};

/**
 * Teardown and destroy the environment and do any associated cleanup.
 *
 * @public
 * @return {q.promise} A promise which will resolve immediately.
 */
MockDriverProvider.prototype.teardownEnv = function() {
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
MockDriverProvider.prototype.getDrivers = function() {
  this.drivers_ = [];
  for (var i = 0; i < this.config_.numDrivers; ++i) {
    var mockSession = new webdriver.Session('test_session_id', {});
    this.drivers_.push(new webdriver.WebDriver(mockSession, new MockExecutor()));
  }
  
  return this.drivers_;
};

// new instance w/ each include
module.exports = function(config) {
  return new MockDriverProvider(config);
};
