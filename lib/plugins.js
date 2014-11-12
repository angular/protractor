var q = require('q');

/**
 * The plugin API for Protractor.  Note that this API is extremely unstable
 * and current consists of only two functions:
 *    <plugin>.setup - called before tests
 *    <plugin>.teardown - called after tests
 * More information on plugins coming in the future
 * @constructor
 */
var Plugins = function(config) {
  this.pluginConfs = config.plugins || {};
  this.pluginObjs = {};
  for (var name in this.pluginConfs) {
    this.pluginObjs[name] = require(this.pluginConfs[name].path);
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
