var q = require('q'),
    helper = require('./util'),
    ConfigParser = require('./configParser');

var logPrefix = '[plugins]';

/**
 * Custom console.log proxy
 * @param {*} [stuff...] Any value to log
 * @private
 */
var log_ = function() {
  var args = [logPrefix].concat([].slice.call(arguments));
  console.log.apply(console, args);
};

/**
 * The plugin API for Protractor.  Note that this API is unstable. See
 * plugins/README.md for more information.
 *
 * @constructor
 * @param {Object} config parsed from the config file
 */
var Plugins = function(config) {
  this.pluginConfs = config.plugins;
  this.pluginObjs = {};
  for (var name in this.pluginConfs) {
    var pluginConf = this.pluginConfs[name];
    var path;
    if (pluginConf.path) {
      path = ConfigParser.resolveFilePatterns(pluginConf.path, true,
          config.configDir)[0];
    } else {
      path = pluginConf.package || name;
    }
    this.pluginObjs[name] = require(path);
  }
};

var green = '\x1b[32m';
var red = '\x1b[31m';
var normalColor = '\x1b[39m';

var printResult = function(message, pass) {
  console.log(pass ? green : red, '\t', pass ? 'Pass: ' : 'Fail: ', message, normalColor);
};

var noop = function() {};

function pluginFunFactory(funName) {
  return function() {
    var names = [];
    var promises = [];
    for (var name in this.pluginConfs) {
      var pluginConf = this.pluginConfs[name];
      var pluginObj = this.pluginObjs[name];
      names.push(name);
      promises.push(
          (pluginObj[funName] || noop).apply(
              pluginObj[funName],
              [pluginConf].concat([].slice.call(arguments))));
    }

    return q.all(promises).then(function(results) {
      // Join the results into a single object and output any test results
      var ret = {failedCount: 0};

      for (var i = 0; i < results.length; i++) {
        var pluginResult = results[i];
        if (!!pluginResult && (typeof pluginResult == typeof {})) {
          if (typeof pluginResult.failedCount != typeof 1) {
            log_('Plugin "' + names[i] + '" returned a malformed object');
            continue; // Just ignore this result
          }

          // Output test results
          if (pluginResult.specResults) {
            console.log('Plugin: ' + names[i] + ' (' + funName + ')');
            for (var j = 0; j < pluginResult.specResults.length; j++) {
              var specResult = pluginResult.specResults[j];
              var passed = specResult.assertions.map(function(x) {
                return x.passed;
              }).reduce(function(x, y) {
                return x && y;
              }, true);


              printResult(specResult.description, passed);
              if (!passed) {
                for (var k = 0; k < specResult.assertions.length; k++) {
                  if (!specResult.assertions[k].passed) {
                    console.log(red, '\t\t' +
                      specResult.assertions[k].errorMsg, normalColor);
                  }
                }
              }
            }
          }

          // Join objects
          ret = helper.joinTestLogs(ret, pluginResult);
        }
      }

      return ret;
    });
  };
}

/**
 * Sets up plugins before tests are run.
 *
 * @return {q.Promise} A promise which resolves when the plugins have all been
 *     set up.
 */
Plugins.prototype.setup = pluginFunFactory('setup');

/**
 * Tears down plugins after tests are run.
 *
 * @return {q.Promise} A promise which resolves when the plugins have all been
 *     torn down.
 */
Plugins.prototype.teardown = pluginFunFactory('teardown');

/**
 * Run after the test results have been processed (any values returned will
 * be ignored), but before the process exits. Final chance for cleanup.
 *
 * @return {q.Promise} A promise which resolves when the plugins have all been
 *     torn down.
 */
Plugins.prototype.postResults = pluginFunFactory('postResults');

/**
 * Called after each test block completes.
 *
 * @return {q.Promise} A promise which resolves when the plugins have all been
 *     torn down.
 */
Plugins.prototype.postTest = pluginFunFactory('postTest');

module.exports = Plugins;
