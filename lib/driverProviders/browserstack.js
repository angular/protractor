/*
 * This is an implementation of the Browserstack Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */

var util = require('util'),
    log = require('../logger'),
    request = require('request'),
    q = require('q'),
    DriverProvider = require('./driverProvider');


var BrowserStackDriverProvider = function(config) {
  DriverProvider.call(this, config);
};
util.inherits(BrowserStackDriverProvider, DriverProvider);


/**
 * Hook to update the BrowserStack job status.
 * @public
 * @param {Object} update
 * @return {q.promise} A promise that will resolve when the update is complete.
 */
BrowserStackDriverProvider.prototype.updateJob = function(update) {

  var self = this;
  var deferredArray = this.drivers_.map(function(driver) {
    var deferred = q.defer();
    driver.getSession().then(function(session) {
      var jobStatus = update.passed ? 'completed' : 'error';
      log.puts('BrowserStack results available at ' +
          'https://www.browserstack.com/automate');
      request({
          url: 'https://www.browserstack.com/automate/sessions/' +
              session.getId() + '.json',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + new Buffer(self.config_.browserstackUser
                + ':' + self.config_.browserstackKey).toString('base64')
          },
          method: 'PUT',
          form: {
            'status': jobStatus
          }
        }, function(error){
          if (error) {
            throw new Error(
              'Error updating BrowserStack pass/fail status: ' +
                  util.inspect(error)
            );
          }
      });
      deferred.resolve();
    });
    return deferred.promise;
  });
  return q.all(deferredArray);
};

/**
 * Configure and launch (if applicable) the object's environment.
 * @public
 * @return {q.promise} A promise which will resolve when the environment is
 *     ready to test.
 */
BrowserStackDriverProvider.prototype.setupEnv = function() {
  var deferred = q.defer();
  this.config_.capabilities['browserstack.user'] =
      this.config_.browserstackUser;
  this.config_.capabilities['browserstack.key'] = this.config_.browserstackKey;
  this.config_.seleniumAddress = 'http://hub.browserstack.com/wd/hub';

  // Append filename to capabilities.name so that it's easier to identify tests.
  if (this.config_.capabilities.name &&
      this.config_.capabilities.shardTestFiles) {
    this.config_.capabilities.name += (
        ':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
  }

  log.puts('Using BrowserStack selenium server at ' +
      this.config_.seleniumAddress);
  deferred.resolve();
  return deferred.promise;
};

// new instance w/ each include
module.exports = function(config) {
  return new BrowserStackDriverProvider(config);
};
