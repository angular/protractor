"use strict";
var q_1 = require('q');
var path_1 = require('path');
var STACK_SUBSTRINGS_TO_FILTER = [
    'node_modules/jasmine/', 'node_modules/selenium-webdriver', 'at Module.',
    'at Object.Module.', 'at Function.Module', '(timers.js:',
    'jasminewd2/index.js', 'protractor/lib/'
];
/**
 * Utility function that filters a stack trace to be more readable. It removes
 * Jasmine test frames and webdriver promise resolution.
 * @param {string} text Original stack trace.
 * @return {string}
 */
function filterStackTrace(text) {
    if (!text) {
        return text;
    }
    var lines = text.split(/\n/).filter(function (line) {
        for (var _i = 0, STACK_SUBSTRINGS_TO_FILTER_1 = STACK_SUBSTRINGS_TO_FILTER; _i < STACK_SUBSTRINGS_TO_FILTER_1.length; _i++) {
            var filter = STACK_SUBSTRINGS_TO_FILTER_1[_i];
            if (line.indexOf(filter) !== -1) {
                return false;
            }
        }
        return true;
    });
    return lines.join('\n');
}
exports.filterStackTrace = filterStackTrace;
/**
 * Internal helper for abstraction of polymorphic filenameOrFn properties.
 * @param {object} filenameOrFn The filename or function that we will execute.
 * @param {Array.<object>}} args The args to pass into filenameOrFn.
 * @return {q.Promise} A promise that will resolve when filenameOrFn completes.
 */
function runFilenameOrFn_(configDir, filenameOrFn, args) {
    return q_1.Promise(function (resolvePromise) {
        if (filenameOrFn &&
            !(typeof filenameOrFn === 'string' ||
                typeof filenameOrFn === 'function')) {
            throw 'filenameOrFn must be a string or function';
        }
        if (typeof filenameOrFn === 'string') {
            filenameOrFn = require(path_1.resolve(configDir, filenameOrFn));
        }
        if (typeof filenameOrFn === 'function') {
            var results = q_1.when(filenameOrFn.apply(null, args), null, function (err) {
                err.stack = exports.filterStackTrace(err.stack);
                throw err;
            });
            resolvePromise(results);
        }
        else {
            resolvePromise(undefined);
        }
    });
}
exports.runFilenameOrFn_ = runFilenameOrFn_;
/**
 * Joins two logs of test results, each following the format of <framework>.run
 * @param {object} log1
 * @param {object} log2
 * @return {object} The joined log
 */
function joinTestLogs(log1, log2) {
    return {
        failedCount: log1.failedCount + log2.failedCount,
        specResults: (log1.specResults || []).concat(log2.specResults || [])
    };
}
exports.joinTestLogs = joinTestLogs;
