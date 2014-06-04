var path = require('path'),
    glob = require('glob'),
    util = require('util'),
    _ = require('lodash'),
    protractor = require('./protractor.js');

// Coffee is required here to enable config files written in coffee-script.
try {
  require('coffee-script').register();
} catch (e) {
  // Intentionally blank - ignore if coffee-script is not available.
}

// LiveScript is required here to enable config files written in LiveScript.
try {
  require('LiveScript');
} catch (e) {
  // Intentionally blank - ignore if LiveScript is not available.
}

var ConfigParser = function() {
  // Default configuration.
  this.config_= {
    specs: [],
    multiCapabilities: [],
    rootElement: 'body',
    allScriptsTimeout: 11000,
    params: {},
    framework: 'jasmine',
    jasmineNodeOpts: {
      isVerbose: false,
      showColors: true,
      includeStackTrace: true,
      stackFilter: protractor.filterStackTrace,
      defaultTimeoutInterval: (30 * 1000)
    },
    seleniumArgs: [],
    cucumberOpts: {},
    mochaOpts: {
      ui: 'bdd',
      reporter: 'list'
    },
    chromeDriver: null,
    configDir: './'
  };
};

/**
 * Merge config objects together.
 *
 * @private
 * @param {Object} into
 * @param {Object} from
 *
 * @return {Object} The 'into' config.
 */
var merge_ = function(into, from) {
  for (var key in from) {
    if (into[key] instanceof Object && !(into[key] instanceof Array)) {
      merge_(into[key], from[key]);
    } else {
      into[key] = from[key];
    }
  }
  return into;
};

/**
 * Returns the item if it's an array or puts the item in an array
 * if it was not one already.
 */
var makeArray = function(item) {
  return _.isArray(item) ? item : [item];
};

/**
 * Resolve a list of file patterns into a list of individual file paths.
 *
 * @param {Array.<string> | string} patterns
 * @param {=boolean} opt_omitWarnings Whether to omit did not match warnings
 * @param {=string} opt_relativeTo Path to resolve patterns against
 *
 * @return {Array} The resolved file paths.
 */
ConfigParser.resolveFilePatterns =
    function(patterns, opt_omitWarnings, opt_relativeTo) {
  var resolvedFiles = [];
  var cwd = opt_relativeTo || process.cwd();

  patterns = (typeof patterns === 'string') ?
      [patterns] : patterns;

  if (patterns) {
    for (var i = 0; i < patterns.length; ++i) {
      var matches = glob.sync(patterns[i], {cwd: cwd});
      if (!matches.length && !opt_omitWarnings) {
        util.puts('Warning: pattern ' + patterns[i] + ' did not match any files.');
      }
      for (var j = 0; j < matches.length; ++j) {
        resolvedFiles.push(path.resolve(cwd, matches[j]));
      }
    }
  }
  return resolvedFiles;
};

/**
 * Returns only the specs that should run currently based on `config.suite`
 *
 * @return {Array} An array of globs locating the spec files
 */
ConfigParser.getSpecs = function(config) {
  if (config.suite) {
    return config.suites[config.suite];
  }

  if (config.specs.length > 0) {
    return config.specs;
  }

  var specs = [];
  _.forEach(config.suites, function(suite) {
    specs = _.union(specs, makeArray(suite));
  });
  return specs;
};

/**
 * Add the options in the parameter config to this runner instance.
 *
 * @private
 * @param {Object} additionalConfig
 * @param {string} relativeTo the file path to resolve paths against
 */
ConfigParser.prototype.addConfig_ = function(additionalConfig, relativeTo) {
  // All filepaths should be kept relative to the current config location.
  // This will not affect absolute paths.
  ['seleniumServerJar', 'chromeDriver', 'onPrepare'].forEach(function(name) {
    if (additionalConfig[name] && typeof additionalConfig[name] === 'string') {
      additionalConfig[name] =
          path.resolve(relativeTo, additionalConfig[name]);
    }
  });

  // Make sure they're not trying to add in deprecated config vals.
  if (additionalConfig.jasmineNodeOpts &&
        additionalConfig.jasmineNodeOpts.specFolders) {
    throw new Error('Using config.jasmineNodeOpts.specFolders is deprecated ' +
        'since Protractor 0.6.0. Please switch to config.specs.');
  }
  merge_(this.config_, additionalConfig);
};

/**
 * Public function specialized towards merging in a file's config
 *
 * @public
 * @param {String} filename
 */
ConfigParser.prototype.addFileConfig = function(filename) {
  if (!filename) {
    return this;
  }
  var filePath = path.resolve(process.cwd(), filename);
  var fileConfig = require(filePath).config;
  fileConfig.configDir = path.dirname(filePath);
  this.addConfig_(fileConfig, fileConfig.configDir);
  return this;
};


/**
 * Public function specialized towards merging in config from argv
 *
 * @public
 * @param {Object} argv
 */
ConfigParser.prototype.addConfig = function(argv) {
  this.addConfig_(argv, process.cwd());
  return this;
};


/**
 * Public getter for the final, computed config object
 *
 * @public
 * @return {Object} config
 */
ConfigParser.prototype.getConfig = function() {
  return this.config_;
};

module.exports = ConfigParser;
