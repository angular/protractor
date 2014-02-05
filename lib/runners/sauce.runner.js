/*
 *  This is an implementation of the Sauce Test Runner.
 *  It is responsible for setting up the account object, tearing
 *    it down, and setting up the driver correctly.
 */

var AbstractRunner = require(__dirname+'/runner.class'),
  util = require('util'),
  webdriver = require('selenium-webdriver'),
  SauceLabs = require('saucelabs');
  q = require('q');


function SauceTestRunner(config) {

  /**
   * setupEnv is responsible for configuring and launching (if applicable)
   * the object's environment.
   * @private
   */
  this._setupEnv = function() {
    var deferred = q.defer();
    this._sauceServer = new SauceLabs({
      username: this._config.sauceAccount.user,
      password: this._config.sauceAccount.key
    });
    this._config.capabilities.username = config.sauceUser;
    this._config.capabilities.accessKey = config.sauceKey;
    this._config.seleniumHost = 'http://' + config.sauceUser + ':' +
      this._config.sauceAccount.key + '@ondemand.saucelabs.com:80/wd/hub';

    util.puts('Using SauceLabs selenium server at ' +
        this._config.seleniumHost);
    deferred.resolve(this._config.seleniumHost);
    return deferred.promise;
  };

  /**
   * teardownEnv is responsible for destroying the environment and doing any
   * associated cleanup.
   * @private
   * @param {runnerResult} runner 
   * @return promise
   */
  this._teardownEnv = function(runner) {
    var passed = runner.results().failedCount === 0,
      exitCode = passed ? 0 : 1;

    this._sauceServer.updateJob(sessionId, {'passed': passed}, function(err) {
      if (err) {
        throw new Error(
          'Error updating Sauce pass/fail status: ' + util.inspect(err)
        );
      }
      this.exit(exitCode);
    });
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
  return AbstractRunner.init(SauceTestRunner, args);
});
