/*
 *  This is an implementation of the Attach Session Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */

var util = require('util'),
    q = require('q'),
    DriverProvider = require('./driverProvider'),
    log = require('../logger'),
    WebDriver = require('selenium-webdriver').WebDriver,
    executors = require('selenium-webdriver/executors');

var AttachedSessionDriverProvider = function(config) {
  DriverProvider.call(this, config);
};
util.inherits(AttachedSessionDriverProvider, DriverProvider);

/**
 * Configure and launch (if applicable) the object's environment.
 * @public
 * @return {q.promise} A promise which will resolve when the environment is
 *     ready to test.
 */
AttachedSessionDriverProvider.prototype.setupEnv = function() {
  log.puts('Using the selenium server at ' + this.config_.seleniumAddress);
  log.puts('Using session id - ' + this.config_.seleniumSessionId);
  return q(undefined);
};


/**
 * Getting a new driver by attaching an existing session.
 *
 * @public
 * @return {WebDriver} webdriver instance
 */
AttachedSessionDriverProvider.prototype.getNewDriver = function() {
  var executor = executors.createExecutor(this.config_.seleniumAddress);
  var newDriver = WebDriver
    .attachToSession(executor, this.config_.seleniumSessionId);
  this.drivers_.push(newDriver);
  return newDriver;
};

/**
 * Maintains the existing session and does not quit the driver.
 *
 * @public
 */
AttachedSessionDriverProvider.prototype.quitDriver = function() {
};

// new instance w/ each include
module.exports = function(config) {
  return new AttachedSessionDriverProvider(config);
};
