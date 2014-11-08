var q = require('q'),
    ConfigParser = require('./configParser');

/**
 * The plugin API for Protractor.  Note that this API is extremely unstable
 * and current consists of only two functions:
 *    <plugin>.setup - called before tests
 *    <plugin>.teardown - called after tests
 * More information on plugins coming in the future
 * @constructor
 * @param {Object} config parsed from the config file
 */
var Plugins = function(config) {
  //Copy over plugin configurations
  this.pluginConfs = {};
  for (var name in config.plugins) {
    //Filter out non-objects (e.g. Array.length in old browsers)
    if(typeof config.plugins[name] == typeof {}) {
      this.pluginConfs[name] = config.plugins[name];
    }
  }

  //Load objects
  this.pluginObjs = {};
  for (name in this.pluginConfs) {
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




var noop = function() {};

function pluginFunFactory(funName) {
  return function() {
    var promises = [];
    for (var name in this.pluginConfs) {
      var pluginConf = this.pluginConfs[name];
      var pluginObj = this.pluginObjs[name];
      promises.push((pluginObj[funName] || noop)(pluginConf));
    }
    return q.all(promises);
  };
}

/**
 *  Sets up plugins before tests are run.
 *  @return {q.Promise} A promise which resolves when the plugins have all been
 *    set up.
 */
Plugins.prototype.setup = pluginFunFactory('setup');

/**
 *  Tears down plugins after tests are run.
 *  @return {q.Promise} A promise which resolves when the plugins have all been
 *    torn down.
 */
Plugins.prototype.teardown = pluginFunFactory('teardown');

module.exports = Plugins;
