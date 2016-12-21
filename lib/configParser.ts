import * as glob from 'glob';
import * as path from 'path';

import {Capabilities, Config, SpecsSettings, Suite} from './config';
import {ConfigError} from './exitCodes';
import {Logger} from './logger';

let logger = new Logger('configParser');

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

export class ConfigParser {
  private config_: Config;
  constructor() {
    // Default configuration.
    this.config_ = {
      specs: [],
      multiCapabilities: [],
      verboseMultiSessions: false,
      rootElement: 'body',
      allScriptsTimeout: 11000,
      getPageTimeout: 10000,
      params: {},
      framework: 'jasmine',
      jasmineNodeOpts: {showColors: true, defaultTimeoutInterval: (30 * 1000)},
      seleniumArgs: [],
      mochaOpts: {ui: 'bdd', reporter: 'list'},
      configDir: './',
      noGlobals: false,
      plugins: [],
      skipSourceMapSupport: false,
      ng12Hybrid: false
    };
  }

  /**
   * Resolve a list of file patterns into a list of individual file paths.
   *
   * @param {Array.<string> | string} patterns
   * @param {=boolean} opt_omitWarnings Whether to omit did not match warnings
   * @param {=string} opt_relativeTo Path to resolve patterns against
   *
   * @return {Array} The resolved file paths.
   */
  public static resolveFilePatterns(
      patterns: Array<string>|string, opt_omitWarnings?: boolean,
      opt_relativeTo?: string): Array<string> {
    let resolvedFiles: Array<string> = [];
    let cwd = opt_relativeTo || process.cwd();

    patterns = (typeof patterns === 'string') ? [patterns] : patterns;

    if (patterns) {
      for (let fileName of patterns) {
        let matches = glob.hasMagic(fileName) ? glob.sync(fileName, {cwd}) : [fileName];
        if (!matches.length && !opt_omitWarnings) {
          logger.warn('pattern ' + fileName + ' did not match any files.');
        }
        for (let match of matches) {
          let resolvedPath = path.resolve(cwd, match);
          resolvedFiles.push(resolvedPath);
        }
      }
    }
    return resolvedFiles;
  }

  /**
   * Returns only the specs/exclude that should be used for the current suite/capability
   *
   * @precondition All/any capabilities are in specDef.multiCapabilities
   *
   * @return {{specs: string[], exclude: string[]}} globs locating the spec files
   */
  public static getSpecInfo(config: Config, capabilityIndex: number):
      {specs: string[], exclude: string[]} {
    let normalized = normalizeConfig(config);
    let specs: string[] = [];
    let exclude: string[] = [];
    function extractInfo(specSettings: NormalizedSpecsSettings) {
      specSettings.suite.split(',').forEach((suiteName) => {
        let suite = specSettings.suites[suiteName];
        if (suite == null) {
          throw new ConfigError(logger, 'Unknown test suite: ' + suiteName);
        }
        union(specs, suite.specs);
        union(exclude, suite.exclude);
      });
    }
    extractInfo(normalized);
    extractInfo(normalized.multiCapabilities[capabilityIndex]);
    return {specs: specs, exclude: exclude};
  }

  /**
   * Add the options in the parameter config to this runner instance.
   *
   * @private
   * @param {Object} additionalConfig
   * @param {string} relativeTo the file path to resolve paths against
   */
  private addConfig_(additionalConfig: Config, relativeTo: string): void {
    // All filepaths should be kept relative to the current config location.
    // This will not affect absolute paths.
    ['seleniumServerJar', 'chromeDriver', 'onPrepare', 'firefoxPath', 'frameworkPath'].forEach(
        (name) => {
          if (additionalConfig[name] && typeof additionalConfig[name] === 'string') {
            additionalConfig[name] = path.resolve(relativeTo, additionalConfig[name]);
          }
        });


    mergeConfigs_(this.config_, additionalConfig);
  }

  /**
   * Public function specialized towards merging in a file's config
   *
   * @public
   * @param {String} filename
   */
  public addFileConfig(filename: string): ConfigParser {
    if (!filename) {
      return this;
    }
    let filePath = path.resolve(process.cwd(), filename);
    let fileConfig: Config;
    try {
      fileConfig = require(filePath).config as Config;
    } catch (e) {
      throw new ConfigError(logger, 'failed loading configuration file ' + filename, e);
    }
    if (!fileConfig) {
      throw new ConfigError(
          logger, 'configuration file ' + filename + ' did not export a config object');
    }
    fileConfig.configDir = path.dirname(filePath);
    this.addConfig_(fileConfig, fileConfig.configDir);
    return this;
  }

  /**
   * Public function specialized towards merging in config from argv
   *
   * @public
   * @param {Object} argv
   */
  public addConfig(argv: Config): ConfigParser {
    this.addConfig_(argv, process.cwd());
    return this;
  }

  /**
   * Public getter for the final, computed config object
   *
   * @public
   * @return {Object} config
   */
  public getConfig(): Config {
    return this.config_;
  }
}

/**
 * Merge config objects together.
 *
 * @private
 * @param {Object} into
 * @param {Object} from
 *
 * @return {Object} The 'into' config.
 */
let mergeConfigs_ = function(into: Config, from: Config): Config {
  for (let key in from) {
    if (into[key] instanceof Object && !(into[key] instanceof Array) &&
        !(into[key] instanceof Function)) {
      mergeConfigs_(into[key], from[key]);
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
let makeArray = function(item: string|string[]): string[] {
  return Array.isArray(item) ? item : [item];
};

/**
 * Adds to an array all the elements in another array without adding any
 * duplicates
 *
 * @param {Array<string>} dest The array to add to
 * @param {Array<string>} src The array to copy from
 */
let union = function(dest: Array<string>, src: Array<string>): Array<string> {
  let elems: {[key: string]: boolean} = {};
  for (let key of dest) {
    elems[key] = true;
  }
  for (let key of src) {
    if (!elems[key]) {
      dest.push(key);
      elems[key] = true;
    }
  }
  return dest;
};

interface NormalizedSuite {
  specs: string[];
  exclude: string[];
}
function normalizeSuite(suite: string|string[]|Suite): NormalizedSuite {
  if (typeof suite === 'string') {
    return {specs: [suite], exclude: []};
  } else if (Array.isArray(suite)) {
    return {specs: suite, exclude: []};
  } else {
    return {specs: makeArray(suite.specs || []), exclude: makeArray(suite.exclude || [])};
  }
}

interface NormalizedSpecsSettings {
  suites: {[suiteName: string]: NormalizedSuite};
  suite: string;
}
function normalizeSpecsSettings(
    specsSettings: SpecsSettings, allSuiteNames: string[],
    defaultSuiteName: ''|'*'): NormalizedSpecsSettings {
  const defaultSuite = normalizeSuite(specsSettings);
  const oldSuiteMap = specsSettings.suites || {};
  let suites: {[suiteName: string]: NormalizedSuite} = {};
  for (let suiteName of allSuiteNames) {
    suites[suiteName] = normalizeSuite(oldSuiteMap[suiteName] || {});
  }
  union(suites[defaultSuiteName].specs, defaultSuite.specs);
  union(suites['*'].exclude, defaultSuite.exclude);
  return {suites: suites, suite: (specsSettings.suite || '') + ',*'};
}

interface NormalizedConfig extends NormalizedSpecsSettings {
  multiCapabilities: NormalizedSpecsSettings[];
}
function normalizeConfig(config: Config): NormalizedConfig {
  if (config.__normalized) {
    return config.__normalized;
  }

  function getSuiteNames(specsSettings: SpecsSettings) {
    return Object.keys(specsSettings.suites || {});
  }
  let suiteNames: string[] = union(['', '*'], getSuiteNames(config));
  config.multiCapabilities.map(getSuiteNames).forEach(union.bind(null, suiteNames));

  let normalized = normalizeSpecsSettings(config, suiteNames, '') as NormalizedConfig;
  const runAllSuites = (config.suite == null) && (normalized.suites[''].specs.length == 0);
  if (runAllSuites) {
    normalized.suite = suiteNames.join(',');
  }

  normalized.multiCapabilities = [];
  for (let capabilities of config.multiCapabilities) {
    let specSettings = normalizeSpecsSettings(capabilities, suiteNames, '*');
    if ((config.suite != null) || runAllSuites) {
      specSettings.suite = normalized.suite;
    }
    normalized.multiCapabilities.push(specSettings);
  }

  return ((config as any).__normalized = normalized);
}
