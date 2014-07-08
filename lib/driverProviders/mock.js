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
  this.driver_ = null;
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
MockDriverProvider.prototype.getDriver = function() {
  var mockSession = new webdriver.Session('test_session_id', {});

  this.driver_ = new webdriver.WebDriver(mockSession, new MockExecutor());
  return this.driver_;
};

// new instance w/ each include
module.exports = function(config) {
  return new MockDriverProvider(config);
};
