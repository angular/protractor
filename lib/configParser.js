var path = require('path'),
    glob = require('glob'),
    log = require('./logger'),
    _ = require('lodash'),
    helper = require('./util');

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
    getPageTimeout: 10000,
    params: {},
    framework: 'jasmine',
    jasmineNodeOpts: {
      isVerbose: false,
      showColors: true,
      includeStackTrace: true,
      stackFilter: helper.filterStackTrace,
      defaultTimeoutInterval: (30 * 1000)
    },
    seleniumArgs: [],
    cucumberOpts: {},
    mochaOpts: {
      ui: 'bdd',
      reporter: 'list'
    },
    chromeDriver: null,
    configDir: './',
    plugins: {}
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
    if (into[key] instanceof Object &&
        !(into[key] instanceof Array) &&
        !(into[key] instanceof Function)) {
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
      // TODO: This shouldn't be neccesary. Check the paths to this method.
      // It's used to avoid a test fail.
      // Detect the source of the issue, fix it and delete the three lines below.  
      if (typeof patterns[i] === 'string') {
        patterns[i] = {spec: patterns[i], suite: undefined};
      }

      var matches = glob.sync(patterns[i].spec, {cwd: cwd});
      if (!matches.length && !opt_omitWarnings) {
        log.warn('pattern ' + patterns[i].spec + ' did not match any files.');
      }
      for (var j = 0; j < matches.length; ++j) {
        resolvedFiles.push({
          spec: path.resolve(cwd, matches[j]),
          suite: patterns[i].suite              
        });
      }
    }
  }
  return resolvedFiles;
};

/**
 * Returns only the specs that should run currently based on `config.suite`
 *
 * @return {Array} An array of objects that contains globs locating the spec files 
 *                 and the suite related with that glob.
 */
ConfigParser.getSpecs = function(config) {
  var specs = [];
  if (config.suite) {                
    _.forEach(config.suite.split(','), function(suite) {
      var suiteList = config.suites[suite];
      if (suiteList == null) {
        throw new Error('Unknown test suite: ' + suite);
      }

      var suiteSpecs = makeArray(suiteList);

      _.forEach(suiteSpecs, function(spec) {
        specs.push({
          spec: spec,
          suite: suite
        });
      });        
      
    });

    return specs;
  }

  if (config.specs.length > 0) {
    return _.map(config.specs, function(spec) {
      return {
        spec: spec,
        suite: undefined
      };
    });
  }

  _.forEach(config.suites, function(suite) {
    var suiteSpecs = makeArray(suite).map(function(spec) {
      return {
        spec: spec,
        suite: suite
      };            
    });        
        
    specs = _.union(specs, suiteSpecs);
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
  ['seleniumServerJar', 'chromeDriver', 'onPrepare', 'firefoxPath'].
      forEach(function(name) {
        if (additionalConfig[name] &&
            typeof additionalConfig[name] === 'string') {
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

  // chromeOnly is deprecated, use directConnect instead.
  if (additionalConfig.chromeOnly) {
    log.warn('chromeOnly is deprecated. Use directConnect');
    additionalConfig.directConnect = true;
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
  try {
    if (!filename) {
      return this;
    }
    var filePath = path.resolve(process.cwd(), filename);
    var fileConfig = require(filePath).config;
    if (!fileConfig) {
      log.error('configuration file ' + filename + ' did not export a config ' +
          'object');
    }
    fileConfig.configDir = path.dirname(filePath);
    this.addConfig_(fileConfig, fileConfig.configDir);
  } catch (e) {
    log.error('failed loading configuration file ' + filename);
    throw e;
  }
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
