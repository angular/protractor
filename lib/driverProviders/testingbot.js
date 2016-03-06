/*
 * This is an implementation of the TestingBot Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */

var util = require('util'),
    log = require('../logger'),
    TestingBot = require('testingbot-api'),
    crypto = require('crypto'),
    q = require('q'),
    DriverProvider = require('./driverProvider');


var TestingBotDriverProvider = function(config) {
  DriverProvider.call(this, config);
  this.tbServer_ = {};
};
util.inherits(TestingBotDriverProvider, DriverProvider);


/**
 * Hook to update the TestingBot job.
 * @public
 * @param {Object} update
 * @return {q.promise} A promise that will resolve when the update is complete.
 */
TestingBotDriverProvider.prototype.updateJob = function(update) {
  var self = this;
  var deferredArray = this.drivers_.map(function(driver) {
    var deferred = q.defer();
    driver.getSession().then(function(session) {
      var hash = crypto.createHash('md5');
      var auth = hash.update(self.config_.testingbotKey + ':' +
        self.config_.testingbotSecret + ':' + session.getId()).digest('hex');
      log.puts('TestingBot results available at http://testingbot.com/tests/' +
          session.getId() + '?auth=' + auth);
      var apiSend = {
        'test[success]' : update.passed ? 1 : 0
      };
      self.tbServer_.updateTest(apiSend, session.getId(), function(err) {
        if (err) {
          throw new Error(
            'Error updating TestingBot pass/fail status: ' + util.inspect(err)
          );
        }
        deferred.resolve();
      });
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
TestingBotDriverProvider.prototype.setupEnv = function() {
  var deferred = q.defer();
  this.tbServer_ = new TestingBot({
    api_key: this.config_.testingbotKey,
    api_secret: this.config_.testingbotSecret
  });
  this.config_.capabilities.username = this.config_.testingbotKey;
  this.config_.capabilities.accessKey = this.config_.testingbotSecret;
  var auth = 'http://' + this.config_.testingbotKey + ':' +
    this.config_.testingbotSecret + '@';
  this.config_.seleniumAddress = auth +
      'hub.testingbot.com:80/wd/hub';

  // Append filename to capabilities.name so that it's easier to identify tests.
  if (this.config_.capabilities.name &&
      this.config_.capabilities.shardTestFiles) {
    this.config_.capabilities.name += (
        ':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
  }

  log.puts('Using TestingBot selenium server at ' +
      this.config_.seleniumAddress.replace(/\/\/.+@/, '//'));
  deferred.resolve();
  return deferred.promise;
};

// new instance w/ each include
module.exports = function(config) {
  return new TestingBotDriverProvider(config);
};
