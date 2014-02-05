/*
 *  This is an implementation of the Hosted Test Runner.
 *  It is responsible for setting up the account object, tearing
 *    it down, and setting up the driver correctly.
 */

var AbstractRunner = require(__dirname+'/runner.class'),
  util = require('util'),
  webdriver = require('selenium-webdriver'),
  q = require('q');


function HostedTestRunner(config) {

  /**
   * setupEnv is responsible for configuring and launching (if applicable)
   * the object's environment.
   * @private
   * @return promise
   */
  this._setupEnv = function() {
    var deferred = q.defer();
    util.puts('Using the selenium server at ' + this._config.seleniumHost);
    deferred.resolve(this._config.seleniumHost);
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
      this._driver = new webdriver.Builder().
      usingServer(this._config.seleniumHost).
      withCapabilities(this._config.capabilities).build();
    }
    return this._driver;
  };

  //load up config
  this.loadConfig(config);
}

//new instance w/ each include
module.exports = (function(args) {
  return AbstractRunner.init(HostedTestRunner, args);
});
