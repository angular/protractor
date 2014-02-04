/*
 *  This is an implementation of the Chrome Test Runner.
 *  It is responsible for setting up the account object, tearing
 *    it down, and setting up the driver correctly.
 */

var AbstractRunner = require(__dirname+'/runner.class'),
  util = require('util'),
  webdriver = require('selenium-webdriver'),
  chrome = require('selenium-webdriver/chrome'),
  q = require('q');


function ChromeTestRunner(config) {

  /**
   * setupEnv is responsible for configuring and launching (if applicable)
   * the object's environment.
   * @private
   * @return promise
   */
  this._setupEnv = function() {
    var deferred = q.defer();
    util.puts('Using ChromeDriver directly...');
    deferred.resolve();
    return deferred.promise;
  };

  /**
   * teardownEnv is responsible for destroying the environment and doing any
   * associated cleanup.
   * @private
   * @param {runnerResult} runner 
   */
  this._teardownEnv = function(runner) {
    var passed = runner.results().failedCount === 0,
      exitCode = passed ? 0 : 1;

    this.exit(exitCode);
  };

  /**
   * getDriver is responsible for retrieving the webdriver for the runner.
   * @public
   * @return webdriver instance
   */
  this.getDriver = function() {
    if(!this._driver) {
      var service = new chrome.ServiceBuilder(config.chromeDriver).build();
      this._driver = chrome.createDriver(
      new webdriver.Capabilities(config.capabilities), service);
    }
    return this._driver;
  };

  //load up config
  this.loadConfig(config);
}

//new instance w/ each include
module.exports = (function(args) {
  return AbstractRunner.init(ChromeTestRunner, args);
});