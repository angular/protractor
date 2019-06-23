import * as path from 'path';
import * as webdriver from 'selenium-webdriver';

let STACK_SUBSTRINGS_TO_FILTER = [
  'node_modules/jasmine/', 'node_modules/selenium-webdriver', 'at Module.', 'at Object.Module.',
  'at Function.Module', '(timers.js:', 'protractor/lib/'
];


/**
 * Utility function that filters a stack trace to be more readable. It removes
 * Jasmine test frames and webdriver promise resolution.
 * @param {string} text Original stack trace.
 * @return {string}
 */
export function filterStackTrace(text: string): string {
  if (!text) {
    return text;
  }
  let lines = text.split(/\n/).filter((line) => {
    for (let filter of STACK_SUBSTRINGS_TO_FILTER) {
      if (line.indexOf(filter) !== -1) {
        return false;
      }
    }
    return true;
  });
  return lines.join('\n');
}

/**
 * Internal helper for abstraction of polymorphic filenameOrFn properties.
 * @param {object} filenameOrFn The filename or function that we will execute.
 * @param {Array.<object>}} args The args to pass into filenameOrFn.
 * @return {Promise} A promise that will resolve when filenameOrFn completes.
 */
export async function runFilenameOrFn_(
    configDir: string, filenameOrFn: any, args?: any[]): Promise<any> {
  if (filenameOrFn && !(typeof filenameOrFn === 'string' || typeof filenameOrFn === 'function')) {
    throw new Error('filenameOrFn must be a string or function');
  }

  if (typeof filenameOrFn === 'string') {
    filenameOrFn = require(path.resolve(configDir, filenameOrFn));
  }
  if (typeof filenameOrFn === 'function') {
    let results;
    try {
      results = await filenameOrFn.apply(null, args);
    } catch (err) {
      if (typeof err === 'string') {
        err = new Error(err);
      } else {
        err = err as Error;
        if (!err.stack) {
          err.stack = new Error().stack;
        }
      }
      err.stack = exports.filterStackTrace(err.stack);
      throw err;
    }
    return results;
  } else {
    return undefined;
  }
}

/**
 * Joins two logs of test results, each following the format of <framework>.run
 * @param {object} log1
 * @param {object} log2
 * @return {object} The joined log
 */
export function joinTestLogs(log1: any, log2: any): any {
  return {
    failedCount: log1.failedCount + log2.failedCount,
    specResults: (log1.specResults || []).concat(log2.specResults || [])
  };
}

/**
 * Returns false if an error indicates a missing or stale element, re-throws
 * the error otherwise
 *
 * @param {*} The error to check
 * @throws {*} The error it was passed if it doesn't indicate a missing or stale
 *   element
 * @return {boolean} false, if it doesn't re-throw the error
 */
export function falseIfMissing(error: any) {
  if ((error instanceof webdriver.error.NoSuchElementError) ||
      (error instanceof webdriver.error.StaleElementReferenceError)) {
    return false;
  } else {
    throw error;
  }
}

/**
 * Return a boolean given boolean value.
 *
 * @param {boolean} value
 * @returns {boolean} given value
 */
export function passBoolean(value: boolean) {
  return value;
}