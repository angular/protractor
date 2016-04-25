"use strict";
var path = require('path');
var glob = require('glob');
var logger2_1 = require('./logger2');
var exitCodes_1 = require('./exitCodes');
var logger = new logger2_1.Logger('configParser');
// Coffee is required here to enable config files written in coffee-script.
try {
    require('coffee-script').register();
}
catch (e) {
}
// LiveScript is required here to enable config files written in LiveScript.
try {
    require('LiveScript');
}
catch (e) {
}
var ConfigParser = (function () {
    function ConfigParser() {
        // Default configuration.
        this.config_ = {
            specs: [],
            multiCapabilities: [],
            rootElement: 'body',
            allScriptsTimeout: 11000,
            getPageTimeout: 10000,
            params: {},
            framework: 'jasmine',
            jasmineNodeOpts: { showColors: true, defaultTimeoutInterval: (30 * 1000) },
            seleniumArgs: [],
            mochaOpts: { ui: 'bdd', reporter: 'list' },
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
    ConfigParser.resolveFilePatterns = function (patterns, opt_omitWarnings, opt_relativeTo) {
        var resolvedFiles = [];
        var cwd = opt_relativeTo || process.cwd();
        patterns = (typeof patterns === 'string') ? [patterns] : patterns;
        if (patterns) {
            for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
                var fileName = patterns_1[_i];
                var matches = glob.sync(fileName, { cwd: cwd });
                if (!matches.length && !opt_omitWarnings) {
                    logger.warn('pattern ' + fileName + ' did not match any files.');
                }
                for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                    var match = matches_1[_a];
                    var resolvedPath = path.resolve(cwd, match);
                    resolvedFiles.push(resolvedPath);
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
    ConfigParser.getSpecs = function (config) {
        var specs = [];
        if (config.suite) {
            config.suite.split(',').forEach(function (suite) {
                var suiteList = config.suites ? config.suites[suite] : null;
                if (suiteList == null) {
                    throw new exitCodes_1.ConfigError(logger, 'Unknown test suite: ' + suite);
                }
                union(specs, makeArray(suiteList));
            });
            return specs;
        }
        if (config.specs.length > 0) {
            return config.specs;
        }
        Object.keys(config.suites || {}).forEach(function (suite) {
            union(specs, makeArray(config.suites[suite]));
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
    ConfigParser.prototype.addConfig_ = function (additionalConfig, relativeTo) {
        // All filepaths should be kept relative to the current config location.
        // This will not affect absolute paths.
        ['seleniumServerJar', 'chromeDriver', 'onPrepare', 'firefoxPath',
            'frameworkPath']
            .forEach(function (name) {
            if (additionalConfig[name] &&
                typeof additionalConfig[name] === 'string') {
                additionalConfig[name] =
                    path.resolve(relativeTo, additionalConfig[name]);
            }
        });
        merge_(this.config_, additionalConfig);
    };
    /**
     * Public function specialized towards merging in a file's config
     *
     * @public
     * @param {String} filename
     */
    ConfigParser.prototype.addFileConfig = function (filename) {
        if (!filename) {
            return this;
        }
        var filePath = path.resolve(process.cwd(), filename);
        var fileConfig;
        try {
            fileConfig = require(filePath).config;
        }
        catch (e) {
            throw new exitCodes_1.ConfigError(logger, 'failed loading configuration file ' + filename);
        }
        if (!fileConfig) {
            throw new exitCodes_1.ConfigError(logger, 'configuration file ' + filename + ' did not export a config object');
        }
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
    ConfigParser.prototype.addConfig = function (argv) {
        this.addConfig_(argv, process.cwd());
        return this;
    };
    /**
     * Public getter for the final, computed config object
     *
     * @public
     * @return {Object} config
     */
    ConfigParser.prototype.getConfig = function () { return this.config_; };
    return ConfigParser;
}());
exports.ConfigParser = ConfigParser;
/**
 * Merge config objects together.
 *
 * @private
 * @param {Object} into
 * @param {Object} from
 *
 * @return {Object} The 'into' config.
 */
var merge_ = function (into, from) {
    for (var key in from) {
        if (into[key] instanceof Object && !(into[key] instanceof Array) &&
            !(into[key] instanceof Function)) {
            merge_(into[key], from[key]);
        }
        else {
            into[key] = from[key];
        }
    }
    return into;
};
/**
 * Returns the item if it's an array or puts the item in an array
 * if it was not one already.
 */
var makeArray = function (item) {
    return Array.isArray(item) ? item : [item];
};
/**
 * Adds to an array all the elements in another array without adding any
 * duplicates
 *
 * @param {Array<string>} dest The array to add to
 * @param {Array<string>} src The array to copy from
 */
var union = function (dest, src) {
    var elems = {};
    for (var key in dest) {
        elems[dest[key]] = true;
    }
    for (var key in src) {
        if (!elems[src[key]]) {
            dest.push(src[key]);
            elems[src[key]] = true;
        }
    }
};
