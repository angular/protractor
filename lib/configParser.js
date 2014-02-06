var path = require('path'),
    glob = require('glob'),
    config_ = {
      configDir: './',
      jasmineNodeOpts: {}
    },
    //this allows for ease of maintaining public apis of the config while still
    //  allowing for easy variable renames or future config api changes while
    //  supported backwards compatibility
    configMap_ = {

      //structure is internal name -> supported config apis
      'specs': ['specs'],
      'exclude': ['exclude'],
      'capabilities': ['capabilities'],
      'seleniumHost': ['seleniumAddress'],
      'rootElement': ['rootElement'],
      'baseUrl': ['baseUrl'],
      'timeout': ['allScriptsTimeout'],
      'browserParams': ['params'],
      'framework': ['framework'],
      'jasmineOpts': ['jasmineNodeOpts'],
      'mochaOpts': ['mochaOpts'],
      'seleniumLocal.jar': ['seleniumServerJar'],
      'seleniumLocal.args': ['seleniumArgs'],
      'seleniumLocal.port': ['seleniumPort'],
      'sauceAccount.user': ['sauceUser'],
      'sauceAccount.key': ['sauceKey'],
      'chromeDriver': ['chromeDriver'],
      'chromeOnly': ['chromeOnly'],
      'configDir': ['configDir'],
      'cucumberOpts.require': ['cucumberOpts.require'],
      'cucumberOpts.format': ['cucumberOpts.format'],
      'cucumberOpts.tags': ['cucumberOpts.tags']
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
 * Resolve a list of file patterns into a list of individual file paths.
 *
 * @param {Array/String} patterns
 * @param {Boolean} opt_omitWarnings  whether to omit did not match warnings
 *
 * @return {Array} The resolved file paths.
 */
var resolveFilePatterns = function(patterns, opt_omitWarnings) {
  var resolvedFiles = [];

  patterns = (typeof patterns === 'string') ?
      [patterns] : patterns;

  if (patterns) {
    for (var i = 0; i < patterns.length; ++i) {
      var matches = glob.sync(patterns[i], {cwd: config_.configDir});
      if (!matches.length && !opt_omitWarnings) {
        util.puts('Warning: pattern ' + patterns[i] + ' did not match any files.');
      }
      for (var j = 0; j < matches.length; ++j) {
        resolvedFiles.push(path.resolve(config_.configDir, matches[j]));
      }
    }
  }
  return resolvedFiles;
};

/**
 * Helper to resolve file pattern strings relative to the cwd
 *
 * @private
 * @param {Array} list
 */
var processFilePatterns_ = function(list) {
  var patterns = list.split(',');
  patterns.forEach(function(spec, index, arr) {
    arr[index] = path.resolve(process.cwd(), spec);
  });
  return patterns;
};

/**
 * Add the options in the parameter config to this runner instance.
 *
 * @private
 * @param {Object} additionalConfig
 */
var addConfig_ = function(additionalConfig) {
  // All filepaths should be kept relative to the current config location.
  // This will not affect absolute paths.
  ['seleniumServerJar', 'chromeDriver', 'onPrepare'].forEach(function(name) {
    if (additionalConfig[name] && additionalConfig.configDir &&
      typeof additionalConfig[name] === 'string') {
      additionalConfig[name] =
          path.resolve(additionalConfig.configDir, additionalConfig[name]);
    }
  });

  // Make sure they're not trying to add in deprecated config vals
  if (additionalConfig.jasmineNodeOpts &&
        additionalConfig.jasmineNodeOpts.specFolders) {
    throw new Error('Using config.jasmineNodeOpts.specFolders is deprecated ' +
        'since Protractor 0.6.0. Please switch to config.specs.');
  }
  merge_(config_,additionalConfig);
};


/**
 * Merges in passed in configuration data with existing class defaults
 * @public
 * @param {Object} config - A set of properties collected that will be merged
 *    with AbstractTestRunner defaults
 */
var loadConfig = function(configObj, configToLoad) {

  if (!configToLoad || !configObj) {
    return;
  }

  /* helper to set the correct value for string dot notation */
  function setConfig_(obj, str, val) {
    str = str.split('.');
    while (str.length > 1) {
      obj = obj[str.shift()];
    }
    obj[str.shift()] = val;
  }

  /* helper to retrieve the correct value for string dot notation */
  function getConfig_(obj, str) {
    var arr = str.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
  }

  /* helper to determine whether a config value is empty based on type */
  function isEmpty_(val) {
    return ( val !== null &&
        val !== '' &&
        val !== undefined &&
        !(val instanceof Array &&
            !val.length) &&
        !(val instanceof Object &&
          !Object.keys(val).length)
      );
  }

  //object definition driven merging
  var key,configDef,configAlias,i;
  for (key in configMap_) {

    configDef = configMap_[key];
    for (i=0; i<configDef.length; i++) {
      configAlias = configDef[i];
      var configVal = getConfig_(configToLoad,configAlias);
      if (isEmpty_(configVal)) {
        //override config default w/ passed in config
        setConfig_(configObj,key,configVal);
      }
    }
  }
};




/**
 * Public function specialized towards merging in a file's config
 *
 * @public
 * @param {String} filename
 */
var addFileConfig = function(filename) {
  if (!filename) {
      return;
  }
  var filePath = path.resolve(process.cwd(), filename);
  var fileConfig = require(filePath).config;
  fileConfig.configDir = path.dirname(filePath);
  addConfig_(fileConfig);
};


/**
 * Public function specialized towards merging in config from argv
 *
 * @public
 * @param {Object} argv
 */
var addArgvConfig = function(argv) {
  if (!argv) {
      return;
  }
  // Interpret/parse spec include/exclude patterns
  if (argv.specs) {
    argv.specs = processFilePatterns_(argv.specs);
  }
  if (argv.exclude) {
    argv.exclude = processFilePatterns(argv.exclude);
  }

  addConfig_(argv);
};


/**
 * Public getter for the final, computed config object
 *
 * @public
 * @return {Object} config
 */
var getConfig = function() {
  return config_;
};


exports.addArgvConfig = addArgvConfig;
exports.addFileConfig = addFileConfig;
exports.getConfig = getConfig;
exports.loadConfig = loadConfig;
exports.resolveFilePatterns = resolveFilePatterns;