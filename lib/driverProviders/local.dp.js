/*
 *  This is an implementation of the Local Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *    it down, and setting up the driver correctly.
 */

var util = require('util'),
    webdriver = require('selenium-webdriver'),
    path = require('path'),
    remote = require('selenium-webdriver/remote'),
    fs = require('fs'),
    q = require('q');


function LocalDriverProvider(testRunner) {

  this.testRunner_ = testRunner;
  this.trConfig_ = this.testRunner_.getConfig();
  this.driver_ = null;
}


/**
 * helper to locate the default jar path if none is provided by the user
 * @private
 */
LocalDriverProvider.prototype.locateDefaultJar_ = function() {
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
 * @public
 * @return promise
 */
LocalDriverProvider.prototype.setupEnv = function() {
  var deferred = q.defer(),
    self = this;

  //if there's not already a jar file configured, try to resolve it
  // - otherwise, confirm its existence
  util.puts('Starting selenium standalone server...');
  if (!this.trConfig_.seleniumLocal.jar) {
    this.trConfig_.seleniumLocal.jar = this.locateDefaultJar_();
  } else if (!fs.existsSync(this.trConfig_.seleniumLocal.jar)) {
    throw new Error('there\'s no selenium server jar at the specified ' +
      'location. Do you have the correct version?');
  }

  //configure server
  if (this.trConfig_.chromeDriver) {
    this.trConfig_.seleniumLocal.args.push('-Dwebdriver.chrome.driver=' +
      this.trConfig_.chromeDriver);
  }
  this.testRunner_._server = new remote.SeleniumServer(this.trConfig_.seleniumLocal.jar,
    this.trConfig_.seleniumLocal);

  //start local server, grab hosted address, and resolve promise
  this.testRunner_._server.start().then(function(url) {
    util.puts('Selenium standalone server started at ' + url);
    self._config.seleniumHost = self._server.address();
    deferred.resolve(self._config.seleniumHost);
  });

  return deferred.promise;
};

/**
 * teardownEnv is responsible for destroying the environment and doing any
 * associated cleanup.
 * @public
 * @param {runnerResult} runner 
 */
LocalDriverProvider.prototype.teardownEnv = function(runner) {
  var deferred = q.defer(),
      passed = runner.results().failedCount === 0,
      exitCode = passed ? 0 : 1;

  util.puts('Shutting down selenium standalone server.');
  this.testRunner_._server.stop().bind(this.testRunner_).then(function() {
    deferred.resolve(exitCode);
  });
  return deferred.promise;
};

/**
 * getDriver is responsible for retrieving the webdriver for the runner.
 * @public
 * @return webdriver instance   
 */
LocalDriverProvider.prototype.getDriver = function() {
  if (!this.driver_) {
    this.driver_ = new webdriver.Builder().
    usingServer(this.trConfig_.seleniumHost).
    withCapabilities(this.trConfig_.capabilities).build();
  }
  return this.driver_;
};

//new instance w/ each include
module.exports = (function(testRunner) {
  return new LocalDriverProvider(testRunner);
});
