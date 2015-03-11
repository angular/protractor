var q = require('q');

var testOut = {failedCount: 0, specResults: []};

/**
 * This plugin checks the browser log after each test for warnings and errors. It can be configured to fail a test if either is detected.
 * There is also an optional exclude parameter which accepts both regex and strings,
 * Any log matching the exclude parameter will not fail the test or be logged to the console
 *
 *    exports.config = {
 *      plugins: [{
 *        path: 'node_modules/protractor/plugins/console',
 *        failOnWarning: {Boolean}                (Default - false),
 *        failOnError: {Boolean}                  (Default - true)
 *        exclude: {Array of strings and regex}   (Default - [])
 *      }]
 *    };
 */
var ConsolePlugin = function() {
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
    testOut.specResults.push({
      description: warning.level.name,
      passed: false,
      assertions: [{passed: false, errorMsg: warning.message}]
    });
  });

  errors.map(function(error) {
    testOut.specResults.push({
      description: error.level.name,
      passed: false,
      assertions: [{passed: false, errorMsg: error.message}]
    });
  });
};

/**
 * Determines if a log message is filtered out or not. This can be set at the config stage using the exclude parameter.
 * The parameter accepts both strings and regex
 *
 * @param logMessage
 *      Current log message
 * @returns {boolean}
 */
ConsolePlugin.includeLog = function(logMessage) {
  return this.exclude.filter(function(e) {
      return (e instanceof RegExp) ? logMessage.match(e) : logMessage.indexOf(e) > -1;
    }).length === 0;
};

/**
 * Parses the log and decides whether to throw an error or not
 *
 * @param config
 *        The config of the plugin defined in the protractor config file
 * @returns {!webdriver.promise.Promise.<R>}
 */
ConsolePlugin.parseLog = function(config) {
  var self = this;
  var failOnWarning = (config.failOnWarning === undefined) ? false : config.failOnWarning;
  var failOnError = (config.failOnError == undefined) ? true : config.failOnError;
  this.exclude = config.exclude || [];

  return this.getBrowserLog().then(function(log) {

    var warnings = log.filter(function(node) {
      return (node.level || {}).name === 'WARNING' && self.includeLog(node.message);
    });

    var errors = log.filter(function(node) {
      return (node.level || {}).name === 'SEVERE' && self.includeLog(node.message);
    });

    testOut.failedCount += (warnings.length > 0 && failOnWarning) ? warnings.length : 0;
    testOut.failedCount += (errors.length > 0 && failOnError) ? errors.length : 0;

    if(testOut.failedCount > 0) {
      self.logMessages(warnings, errors);
    }
  });

};

/**
 * Tear-down function used by protractor
 *
 * @param config
 */
ConsolePlugin.prototype.teardown = function(config) {
  return ConsolePlugin.parseLog(config).then(function() {
    return testOut;
  });
};

var consolePlugin = new ConsolePlugin();

exports.teardown = consolePlugin.teardown.bind(consolePlugin);