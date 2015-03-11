var q = require('q');

var testOut = {failedCount: 0, specResults: {assertions: []}};

/**
 * This plugin scans the log after each test and can fail on error and warning messages
 *
 *    exports.config = {
 *      plugins: [{
 *        path: 'node_modules/protractor/plugins/console',
 *        failOnWarning: {Boolean}  (Default - false),
 *        failOnError: {Boolean}    (Default - true)
 *        exclude: {Array}          (Default - [])
 *      }]
 *    };
 */
var ConsolePlugin = function() {
  this.failOnWarning = false;
  this.failOnError = true;
  this.exclude = [];
};

/**
 * Gets the browser log
 *
 * @returns {!webdriver.promise.Promise.<!Array.<!webdriver.logging.Entry>>}
 */
ConsolePlugin.getBrowserLog = function() {
  return browser.manage().logs().get('browser');
};

/**
 * Logs messages to the test output
 *
 * @param warnings
 *      The list of warnings detected by the browser log
 * @param errors
 *      The list of errors detected by the browser log
 */
ConsolePlugin.logMessages = function(warnings, errors) {
  warnings.map(function(warning) {
    //testOut.specResults.assertions.push({description: warning.level.name + ': ' + warning.message, passed: false});
    console.error(warning.level.name + ': ' + warning.message);
  });

  errors.map(function(error) {
    //testOut.specResults.assertions.push({description: error.level.name + ': ' + error.message, passed: false});
    console.error(error.level.name + ': ' + error.message);
  });
};

ConsolePlugin.includeLog = function(logMessage) {
  return this.exclude.filter(function(e) {
      return (e instanceof RegExp) ? logMessage.match(e) : logMessage.indexOf(e) > -1;
    }).length === 0;
};

/**
 * Parses the log and decides whether to throw an error or not
 *
 * @param config
 *      The config from the protractor config file
 * @returns {Deferred.promise}
 */
ConsolePlugin.parseLog = function(config) {
  var self = this;
  var deferred = q.defer();
  var failOnWarning = config.failOnWarning || this.failOnWarning;
  var failOnError = config.failOnError || this.failOnError;
  this.exclude.concat(config.exclude || []);

  this.getBrowserLog().then(function(log) {

    var warnings = log.filter(function(node) {
      return (node.level || {}).name === 'WARNING' && self.includeLog(node.message);
    });

    var errors = log.filter(function(node) {
      return (node.level || {}).name === 'SEVERE' && self.includeLog(node.message);
    });

    if(warnings.length > 0 || errors.length > 0) {
      self.logMessages(warnings, errors);
    }

    testOut.failedCount += (warnings.length > 0 && failOnWarning) ? 1 : 0;
    testOut.failedCount += (errors.length > 0 && failOnError) ? 1 : 0;

    deferred.resolve();
  });

  return deferred.promise;
};

/**
 * Tear-down function used by protractor
 *
 * @param config
 */
ConsolePlugin.prototype.teardown = function(config) {
  var audits = [];

  audits.push(ConsolePlugin.parseLog(config));

  return q.all(audits).then(function(result) {
    return testOut;
  });
};

var consolePlugin = new ConsolePlugin();

exports.teardown = consolePlugin.teardown.bind(consolePlugin);

exports.ConsolePlugin = ConsolePlugin;