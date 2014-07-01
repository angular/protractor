/*
 *  This is an implementation of the Hosted Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */

var util = require('util'),
    webdriver = require('selenium-webdriver'),
    q = require('q');


var HostedDriverProvider = function(config) {
  this.config_ = config;
  this.driver_ = null;
};

/**
 * Configure and launch (if applicable) the object's environment.
 * @public
 * @return {q.promise} A promise which will resolve when the environment is
 *     ready to test.
 */
HostedDriverProvider.prototype.setupEnv = function() {
  var config = this.config_,
      promised = [];
  
  if (q.isPromise(this.config_.seleniumAddress)) {
      promised.push(this.config_.seleniumAddress);
  }
 
  if (q.isPromise(this.config_.capabilities)) {
      promised.push(this.config_.capabilities);
  }
 
  if (q.isPromise(this.config_.multiCapabilities)) {
      promised.push(this.config_.multiCapabilities);
  }
  
  if (promised.length > 0) {
    return q.when(q.allSettled(promised), function(results) {
        results.forEach(function (result) {
            if (result.state === 'fulfilled') {
                //Note: Very loose checking here...
                //Is multiCapability
                if (Array.isArray(result.value)) {
                    config.multiCapability = result.value;
                } else if (typeof result.value === 'string') {
                    config.seleniumAddress = result.value;
                } else {
                    //Is object
                    config.capabilities = result.value;
                }
            } else {
                //What to do if rejected?
            }
        });
        
        util.puts('Using the selenium server at ' + this.config_.seleniumAddress);
    });
  } else {
    util.puts('Using the selenium server at ' + this.config_.seleniumAddress);
    return q.fcall(function() {});
  }
};

/**
 * Teardown and destroy the environment and do any associated cleanup.
 * Shuts down the driver.
 *
 * @public
 * @return {q.promise} A promise which will resolve when the environment
 *     is down.
 */
HostedDriverProvider.prototype.teardownEnv = function() {
  var deferred = q.defer();
  this.driver_.quit().then(function() {
    deferred.resolve();
  });
  return deferred.promise;
};

/**
 * Return the webdriver for the runner.
 * @public
 * @return webdriver instance   
 */
HostedDriverProvider.prototype.getDriver = function() {
  if (!this.driver_) {
    this.driver_ = new webdriver.Builder().
        usingServer(this.config_.seleniumAddress).
        withCapabilities(this.config_.capabilities).
        build();
  }
  return this.driver_;
};

// new instance w/ each include
module.exports = function(config) {
  return new HostedDriverProvider(config);
};
