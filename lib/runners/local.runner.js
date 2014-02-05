/*
 *  This is an implementation of the Local Test Runner.
 *  It is responsible for setting up the account object, tearing
 *    it down, and setting up the driver correctly.
 */

var AbstractRunner = require(__dirname+'/runner.class'),
  util = require('util'),
  webdriver = require('selenium-webdriver'),
  path = require('path'),
  remote = require('selenium-webdriver/remote'),
  fs = require('fs'),
  q = require('q');


function LocalTestRunner(config) {

  this._locateDefaultJar = function() {
    // Try to use the default location.
    var defaultStandalone = path.resolve(__dirname,
      '../../selenium/selenium-server-standalone-' +
      require('../../package.json').webdriverVersions.selenium + '.jar');

    if (!fs.existsSync(defaultStandalone)) {
      throw new Error('Unable to start selenium. ' +
        'You must specify either a seleniumAddress, ' +
        'seleniumServerJar, or saucelabs account, or use webdriver-manager.');
    }
    return defaultStandalone;
  };

  /**
   * setupEnv is responsible for configuring and launching (if applicable)
   * the object's environment.
   * @private
   * @return promise
   */
  this._setupEnv = function() {
    var deferred = q.defer(),
      self = this;

    //if there's not already a jar file configured, try to resolve it
    // - otherwise, confirm its existence
    util.puts('Starting selenium standalone server...');
    if(!this._config.seleniumLocal.jar) {
      this._config.seleniumLocal.jar = this._locateDefaultJar();
    } else if(!fs.existsSync(this._config.seleniumLocal.jar)) {
      throw new Error('there\'s no selenium server jar at the specified ' +
        'location. Do you have the correct version?');
    }

    //configure server
    if (this._config.chromeDriver) {
      this._config.seleniumLocal.args.push('-Dwebdriver.chrome.driver=' +
        this._config.chromeDriver);
    }
    this._server = new remote.SeleniumServer(this._config.seleniumLocal.jar,
      this._config.seleniumLocal);

    //start local server, grab hosted address, and resolve promise
    this._server.start().then(function(url) {
      util.puts('Selenium standalone server started at ' + url);
      self._config.seleniumHost = self._server.address();
      deferred.resolve(self._config.seleniumHost);
    });

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

    util.puts('Shutting down selenium standalone server.');
    this._server.stop().bind(this).then(function() {
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
  return AbstractRunner.init(LocalTestRunner, args);
});
