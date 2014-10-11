var q = require('q'),
    path = require('path');

/**
 * Internal helper for abstraction of polymorphic filenameOrFn properties.
 * @param {object} filenameOrFn The filename or function that we will execute.
 * @param {Array.<object>}} args The args to pass into filenameOrFn.
 * @return {q.Promise} A promise that will resolve when filenameOrFn completes.
 */
exports.runFilenameOrFn_ = function(configDir, filenameOrFn, args) {
  var returned = null;
  if (filenameOrFn) {
    if (typeof filenameOrFn === 'function') {
      returned = filenameOrFn.apply(null, args);
    } else if (typeof filenameOrFn === 'string') {
      filenameOrFn = require(path.resolve(configDir, filenameOrFn));
      if (typeof filenameOrFn === 'function') {
        returned = filenameOrFn.apply(null, args);
      }
    } else {
      throw 'filenameOrFn must be a string or function';
    }
  }
  return q(returned);
};

/**
 * Grab the Driver Provider based on the config.
 */
exports.getDriverProvider = function(config) {
  var runnerPath;
  if (config.directConnect) {
    runnerPath = './driverProviders/direct';
  } else if (config.seleniumAddress) {
    runnerPath = './driverProviders/hosted';
  } else if (config.sauceUser && config.sauceKey) {
    runnerPath = './driverProviders/sauce';
  } else if (config.seleniumServerJar) {
    runnerPath = './driverProviders/local';
  } else if (config.mockSelenium) {
    runnerPath = './driverProviders/mock';
  } else {
    runnerPath = './driverProviders/local';
  }

  return require(runnerPath)(config);
};
