import {resolve, dirname} from 'path';
import {sync} from 'glob';
import * as Logger from './logger';

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

export interface Config {
  specs: Array<string>;
  multiCapabilities: Array<any>;
  capabilities?: any;
  rootElement: string;
  allScriptsTimeout: number;
  getPageTimeout: number;
  params: any;
  framework: string;
  jasmineNodeOpts: {showColors: boolean; defaultTimeoutInterval: number;};
  seleniumArgs: Array<any>;
  seleniumSessionId?: string;
  mochaOpts: {ui: string; reporter: string;};
  chromeDriver?: string;
  configDir: string;
  noGlobals: boolean;
  plugins: Array<any>;
  skipSourceMapSupport: boolean;
  suite?: string;
  suites?: any;
  troubleshoot?: boolean;
  exclude?: Array<string>| string;
  maxSessions?: number;
}

export default class ConfigParser {
  private config_: Config;
  constructor() {
    // Default configuration.
    this.config_ = {
      specs: [],
      multiCapabilities: [],
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
      patterns: Array<string>| string, opt_omitWarnings?: boolean,
      opt_relativeTo?: string): Array<string> {
    let resolvedFiles: Array<string> = [];
    let cwd = opt_relativeTo || process.cwd();

    patterns = (typeof patterns === 'string') ? [patterns] : patterns;

    if (patterns) {
      for (let fileName of patterns) {
        let matches = sync(fileName, {cwd});
        if (!matches.length && !opt_omitWarnings) {
          Logger.warn('pattern ' + fileName + ' did not match any files.');
        }
        for (let match of matches) {
          let resolvedPath = resolve(cwd, match);
          resolvedFiles.push(resolvedPath);
        }
      }
    }
    return resolvedFiles;
  }

  /**
   * Returns only the specs that should run currently based on `config.suite`
   *
   * @return {Array} An array of globs locating the spec files
   */
  static getSpecs(config: Config): Array<string> {
    let specs: Array<string> = [];
    if (config.suite) {
      config.suite.split(',').forEach((suite) => {
        let suiteList = config.suites[suite];
        if (suiteList == null) {
          throw new Error('Unknown test suite: ' + suite);
        }
        union(specs, makeArray(suiteList));
      });
      return specs;
    }

    if (config.specs.length > 0) {
      return config.specs;
    }

    Object.keys(config.suites || {}).forEach((suite) => {
      union(specs, makeArray(config.suites[suite]));
    });
    return specs;
  }

  /**
   * Add the options in the parameter config to this runner instance.
   *
   * @private
   * @param {Object} additionalConfig
   * @param {string} relativeTo the file path to resolve paths against
   */
  private addConfig_(additionalConfig: any, relativeTo: string): void {
    // All filepaths should be kept relative to the current config location.
    // This will not affect absolute paths.
    ['seleniumServerJar', 'chromeDriver', 'onPrepare', 'firefoxPath',
     'frameworkPath']
        .forEach((name) => {
          if (additionalConfig[name] &&
              typeof additionalConfig[name] === 'string') {
            additionalConfig[name] =
                resolve(relativeTo, additionalConfig[name]);
          }
        });

    merge_(this.config_, additionalConfig);
  }

  /**
   * Public function specialized towards merging in a file's config
   *
   * @public
   * @param {String} filename
   */
  public addFileConfig(filename: string): ConfigParser {
    try {
      if (!filename) {
        return this;
      }
      let filePath = resolve(process.cwd(), filename);
      let fileConfig = require(filePath).config;
      if (!fileConfig) {
        Logger.error(
            'configuration file ' + filename + ' did not export a config ' +
            'object');
      }
      fileConfig.configDir = dirname(filePath);
      this.addConfig_(fileConfig, fileConfig.configDir);
    } catch (e) {
      Logger.error('failed loading configuration file ' + filename);
      throw e;
    }
    return this;
  }

  /**
   * Public function specialized towards merging in config from argv
   *
   * @public
   * @param {Object} argv
   */
  public addConfig(argv: any): ConfigParser {
    this.addConfig_(argv, process.cwd());
    return this;
  }

  /**
   * Public getter for the final, computed config object
   *
   * @public
   * @return {Object} config
   */
  public getConfig(): Config { return this.config_; }
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
let merge_ = function(into: any, from: any): any {
  for (let key in from) {
    if (into[key] instanceof Object && !(into[key] instanceof Array) &&
        !(into[key] instanceof Function)) {
      merge_(into[key], from[key]);
    } else {
      // console.log(from[key].toString());
      into[key] = from[key];
    }
  }
  return into;
};

/**
 * Returns the item if it's an array or puts the item in an array
 * if it was not one already.
 */
let makeArray = function(item: any): any {
  return Array.isArray(item) ? item : [item];
};

/**
 * Adds to an array all the elements in another array without adding any
 * duplicates
 *
 * @param {Array<string>} dest The array to add to
 * @param {Array<string>} src The array to copy from
 */
let union = function(dest: Array<string>, src: Array<string>): void {
  let elems: any = {};
  for (let key in dest) {
    elems[dest[key]] = true;
  }
  for (let key in src) {
    if (!elems[src[key]]) {
      dest.push(src[key]);
      elems[src[key]] = true;
    }
  }
};
