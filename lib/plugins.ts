import * as q from 'q';
import * as webdriver from 'selenium-webdriver';

import {Config} from './config';
import {ConfigParser} from './configParser';
import {Logger} from './logger';

let logger = new Logger('plugins');

export enum PromiseType {
  Q,
  WEBDRIVER
}

export interface PluginConfig {
  path?: string;
  package?: string;
  inline?: ProtractorPlugin;
  name?: string;
  [key: string]: any;
}

export interface ProtractorPlugin {
  /**
   * Sets up plugins before tests are run. This is called after the WebDriver
   * session has been started, but before the test framework has been set up.
   *
   * @this {Object} bound to module.exports
   *
   * @throws {*} If this function throws an error, a failed assertion is added to
   *     the test results.
   *
   * @return {Q.Promise=} Can return a promise, in which case protractor will wait
   *     for the promise to resolve before continuing.  If the promise is
   *     rejected, a failed assertion is added to the test results.
   */
  setup?: () => q.Promise<any>;

  /**
   * This is called before the test have been run but after the test framework has
   * been set up.  Analogous to a config file's `onPreare`.
   *
   * Very similar to using `setup`, but allows you to access framework-specific
   * variables/funtions (e.g. `jasmine.getEnv().addReporter()`)
   *
   * @throws {*} If this function throws an error, a failed assertion is added to
   *     the test results.
   *
   * @return {Q.Promise=} Can return a promise, in which case protractor will wait
   *     for the promise to resolve before continuing.  If the promise is
   *     rejected, a failed assertion is added to the test results.
   */
  onPrepare?: () => q.Promise<any>;

  /**
   * This is called after the tests have been run, but before the WebDriver
   * session has been terminated.
   *
   * @this {Object} bound to module.exports
   *
   * @throws {*} If this function throws an error, a failed assertion is added to
   *     the test results.
   *
   * @return {Q.Promise=} Can return a promise, in which case protractor will wait
   *     for the promise to resolve before continuing.  If the promise is
   *     rejected, a failed assertion is added to the test results.
   */
  teardown?: () => q.Promise<any>;

  /**
   * Called after the test results have been finalized and any jobs have been
   * updated (if applicable).
   *
   * @this {Object} bound to module.exports
   *
   * @throws {*} If this function throws an error, it is outputted to the console
   *
   * @return {Q.Promise=} Can return a promise, in which case protractor will wait
   *     for the promise to resolve before continuing.  If the promise is
   *     rejected, an error is logged to the console.
   */
  postResults?: () => q.Promise<any>;

  /**
   * Called after each test block (in Jasmine, this means an `it` block)
   * completes.
   *
   * @param {boolean} passed True if the test passed.
   * @param {Object} testInfo information about the test which just ran.
   *
   * @this {Object} bound to module.exports
   *
   * @throws {*} If this function throws an error, a failed assertion is added to
   *     the test results.
   *
   * @return {Q.Promise=} Can return a promise, in which case protractor will wait
   *     for the promise to resolve before outputting test results.  Protractor
   *     will *not* wait before executing the next test, however.  If the promise
   *     is rejected, a failed assertion is added to the test results.
   */
  postTest?: (passed: boolean, testInfo: any) => q.Promise<any>;

  /**
   * This is called inside browser.get() directly after the page loads, and before
   * angular bootstraps.
   *
   * @this {Object} bound to module.exports
   *
   * @throws {*} If this function throws an error, a failed assertion is added to
   *     the test results.
   *
   * @return {Q.Promise=} Can return a promise, in which case protractor will wait
   *     for the promise to resolve before continuing.  If the promise is
   *     rejected, a failed assertion is added to the test results.
   */
  onPageLoad?: () => q.Promise<any>;

  /**
   * This is called inside browser.get() directly after angular is done
   * bootstrapping/synchronizing.  If browser.ignoreSynchronization is true, this
   * will not be called.
   *
   * @this {Object} bound to module.exports
   *
   * @throws {*} If this function throws an error, a failed assertion is added to
   *     the test results.
   *
   * @return {Q.Promise=} Can return a promise, in which case protractor will wait
   *     for the promise to resolve before continuing.  If the promise is
   *     rejected, a failed assertion is added to the test results.
   */
  onPageStable?: () => q.Promise<any>;

  /**
   * Between every webdriver action, Protractor calls browser.waitForAngular() to
   * make sure that Angular has no outstanding $http or $timeout calls.
   * You can use waitForPromise() to have Protractor additionally wait for your
   * custom promise to be resolved inside of browser.waitForAngular().
   *
   * @this {Object} bound to module.exports
   *
   * @throws {*} If this function throws an error, a failed assertion is added to
   *     the test results.
   *
   * @return {Q.Promise=} Can return a promise, in which case protractor will wait
   *     for the promise to resolve before continuing.  If the promise is
   *     rejected, a failed assertion is added to the test results, and protractor
   *     will continue onto the next command.  If nothing is returned or something
   *     other than a promise is returned, protractor will continue onto the next
   *     command.
   */
  waitForPromise?: () => q.Promise<any>;

  /**
   * Between every webdriver action, Protractor calls browser.waitForAngular() to
   * make sure that Angular has no outstanding $http or $timeout calls.
   * You can use waitForCondition() to have Protractor additionally wait for your
   * custom condition to be truthy.
   *
   * @this {Object} bound to module.exports
   *
   * @throws {*} If this function throws an error, a failed assertion is added to
   *     the test results.
   *
   * @return {Q.Promise<boolean>|boolean} If truthy, Protractor will continue onto
   *     the next command.  If falsy, webdriver will continuously re-run this
   *     function until it is truthy.  If a rejected promise is returned, a failed
   *     assertion is added to the test results, and protractor will continue onto
   *     the next command.
   */
  waitForCondition?: () => q.Promise<any>;

  /**
   * Used to turn off default checks for angular stability
   *
   * Normally Protractor waits for all $timeout and $http calls to be processed
   * before executing the next command.  This can be disabled using
   * browser.ignoreSynchronization, but that will also disable any
   * <Plugin>.waitForPromise or <Plugin>.waitForCondition checks.  If you want
   * to
   * disable synchronization with angular, but leave in tact any custom plugin
   * synchronization, this is the option for you.
   *
   * This is used by users who want to replace Protractor's synchronization code
   * This is used by users who want to replace Protractor's synchronization code
   * with their own.
   *
   * @type {boolean}
   */
  skipAngularStability?: boolean;

  /**
   * Used when reporting results.
   *
   * If you do not specify this property, it will be filled in with something
   * reasonable (e.g. the plugin's path)
   *
   * @type {string}
   */
  name?: string;

  /**
   * The plugin configuration object. Note that this is not the entire
   * Protractor config object, just the entry in the plugins array for this
   * plugin.
   *
   * @type {Object}
   */
  config?: PluginConfig;

  /**
   * Adds a failed assertion to the test's results. Note: this is added by the
   * Protractor API, not to be implemented by the plugin author.
   *
   * @param {string} message The error message for the failed assertion
   * @param {specName: string, stackTrace: string} options Some optional extra
   *     information about the assertion:
   *       - specName The name of the spec which this assertion belongs to.
   *            Defaults to `PLUGIN_NAME + ' Plugin Tests'`.
   *       - stackTrace The stack trace for the failure.  Defaults to undefined.
   *     Defaults to `{}`.
   *
   * @throws {Error} Throws an error if called after results have been reported
   */
  addFailure?: (message?: string, info?: {specName?: string, stackTrace?: string}) => void;

  /**
   * Adds a passed assertion to the test's results. Note: this is added by the
   * Protractor API, not to be implemented by the plugin author.
   *
   * @param {specName: string} options Extra information about the assertion:
   *       - specName The name of the spec which this assertion belongs to.
   *            Defaults to `PLUGIN_NAME + ' Plugin Tests'`.
   *     Defaults to `{}`.
   *
   * @throws {Error} Throws an error if called after results have been reported
   */
  addSuccess?: (info?: {specName?: string}) => void;

  /**
   * Warns the user that something is problematic. Note: this is added by the
   * Protractor API, not to be implemented by the plugin author.
   *
   * @param {string} message The message to warn the user about
   * @param {specName: string} options Extra information about the assertion:
   *       - specName The name of the spec which this assertion belongs to.
   *            Defaults to `PLUGIN_NAME + ' Plugin Tests'`.
   *     Defaults to `{}`.
   */
  addWarning?: (message?: string, info?: {specName?: string}) => void;
}

/**
 * The plugin API for Protractor.  Note that this API is unstable. See
 * plugins/README.md for more information.
 *
 * @constructor
 * @param {Object} config parsed from the config file
 */
export class Plugins {
  pluginObjs: ProtractorPlugin[];
  assertions: {[key: string]: AssertionResult[]};
  resultsReported: boolean;

  constructor(config: Config) {
    this.pluginObjs = [];
    this.assertions = {};
    this.resultsReported = false;
    if (config.plugins) {
      config.plugins.forEach((pluginConf, i) => {
        let path: string;
        if (pluginConf.path) {
          path = ConfigParser.resolveFilePatterns(pluginConf.path, true, config.configDir)[0];
          if (!path) {
            throw new Error('Invalid path to plugin: ' + pluginConf.path);
          }
        } else {
          path = pluginConf.package;
        }

        let pluginObj: ProtractorPlugin;
        if (path) {
          pluginObj = require(path) as ProtractorPlugin;
        } else if (pluginConf.inline) {
          pluginObj = pluginConf.inline;
        } else {
          throw new Error(
              'Plugin configuration did not contain a valid path or ' +
              'inline definition.');
        }

        this.annotatePluginObj(pluginObj, pluginConf, i);

        logger.debug('Plugin "' + pluginObj.name + '" loaded.');
        this.pluginObjs.push(pluginObj);
      });
    }
  };

  /**
   * Adds properties to a plugin's object
   *
   * @see docs/plugins.md#provided-properties-and-functions
   */
  private annotatePluginObj(obj: ProtractorPlugin, conf: PluginConfig, i: number): void {
    let addAssertion =
        (info: {specName?: string, stackTrace?: string}, passed: boolean, message?: string) => {
          if (this.resultsReported) {
            throw new Error(
                'Cannot add new tests results, since they were already ' +
                'reported.');
          }
          info = info || {};
          const specName = info.specName || (obj.name + ' Plugin Tests');
          const assertion: AssertionResult = {passed: passed};
          if (!passed) {
            assertion.errorMsg = message;
            if (info.stackTrace) {
              assertion.stackTrace = info.stackTrace;
            }
          }
          this.assertions[specName] = this.assertions[specName] || [];
          this.assertions[specName].push(assertion);
        };

    obj.name = obj.name || conf.name || conf.path || conf.package || ('Plugin #' + i);
    obj.config = conf;
    obj.addFailure = (message?, info?) => {
      addAssertion(info, false, message);
    };
    obj.addSuccess = (options?) => {
      addAssertion(options, true);
    };
    obj.addWarning = (message?, options?) => {
      options = options || {};
      logger.warn(
          'Warning ' +
          (options.specName ? 'in ' + options.specName : 'from "' + obj.name + '" plugin') + ': ' +
          message);
    };
  }

  private printPluginResults(specResults: SpecResult[]) {
    const green = '\x1b[32m';
    const red = '\x1b[31m';
    const normalColor = '\x1b[39m';

    const printResult = (message: string, pass: boolean) => {
      logger.info(pass ? green : red, '\t', pass ? 'Pass: ' : 'Fail: ', message, normalColor);
    };

    for (const specResult of specResults) {
      const passed = specResult.assertions.map(x => x.passed).reduce((x, y) => (x && y), true);
      printResult(specResult.description, passed);
      if (!passed) {
        for (const assertion of specResult.assertions) {
          if (!assertion.passed) {
            logger.error('\t\t' + assertion.errorMsg);
            if (assertion.stackTrace) {
              logger.error('\t\t' + assertion.stackTrace.replace(/\n/g, '\n\t\t'));
            }
          }
        }
      }
    }
  }

  /**
   * Gets the tests results generated by any plugins
   *
   * @see lib/frameworks/README.md#requirements for a complete description of what
   *     the results object must look like
   *
   * @return {Object} The results object
   */
  getResults() {
    const results = {failedCount: 0, specResults: [] as SpecResult[]};
    for (const specName in this.assertions) {
      results.specResults.push({description: specName, assertions: this.assertions[specName]});
      results.failedCount +=
          this.assertions[specName].filter(assertion => !assertion.passed).length;
    }
    this.printPluginResults(results.specResults);
    this.resultsReported = true;
    return results;
  };

  /**
   * Returns true if any loaded plugin has skipAngularStability enabled.
   *
   * @return {boolean}
   */
  skipAngularStability() {
    const result = this.pluginObjs.some(pluginObj => pluginObj.skipAngularStability);
    return result;
  };

  /**
   * @see docs/plugins.md#writing-plugins for information on these functions
   */
  setup = this.pluginFunFactory('setup', PromiseType.Q);
  onPrepare = this.pluginFunFactory('onPrepare', PromiseType.Q);
  teardown = this.pluginFunFactory('teardown', PromiseType.Q);
  postResults = this.pluginFunFactory('postResults', PromiseType.Q);
  postTest = this.pluginFunFactory('postTest', PromiseType.Q);
  onPageLoad = this.pluginFunFactory('onPageLoad', PromiseType.WEBDRIVER);
  onPageStable = this.pluginFunFactory('onPageStable', PromiseType.WEBDRIVER);
  waitForPromise = this.pluginFunFactory('waitForPromise', PromiseType.WEBDRIVER);
  waitForCondition = this.pluginFunFactory('waitForCondition', PromiseType.WEBDRIVER, true);

  /**
   * Calls a function from a plugin safely.  If the plugin's function throws an
   * exception or returns a rejected promise, that failure will be logged as a
   * failed test result instead of crashing protractor.  If the tests results have
   * already been reported, the failure will be logged to the console.
   *
   * @param {Object} pluginObj The plugin object containing the function to be run
   * @param {string} funName The name of the function we want to run
   * @param {*[]} args The arguments we want to invoke the function with
   * @param {PromiseType} promiseType The type of promise (WebDriver or Q) that
   *    should be used
   * @param {boolean} resultsReported If the results have already been reported
   * @param {*} failReturnVal The value to return if the function fails
   *
   * @return {webdriver.promise.Promise|Q.Promise} A promise which resolves to the
   *     function's return value
   */
  private safeCallPluginFun(
      pluginObj: ProtractorPlugin, funName: string, args: any[], promiseType: PromiseType,
      failReturnVal: any) {
    const resolver = (done: (result: any) => void) => {
      const logError = (e: any) => {
        if (this.resultsReported) {
          this.printPluginResults([{
            description: pluginObj.name + ' Runtime',
            assertions: [{
              passed: false,
              errorMsg: 'Failure during ' + funName + ': ' + (e.message || e),
              stackTrace: e.stack
            }]
          }]);
        } else {
          pluginObj.addFailure(
              'Failure during ' + funName + ': ' + e.message || e, {stackTrace: e.stack});
        }
        done(failReturnVal);
      };
      try {
        const result = (pluginObj as any)[funName].apply(pluginObj, args);
        if (webdriver.promise.isPromise(result)) {
          (result as PromiseLike<any>).then(done, logError);
        } else {
          done(result);
        }
      } catch (e) {
        logError(e);
      }
    };
    return promiseType == PromiseType.Q ? q.Promise(resolver) :
                                          new webdriver.promise.Promise(resolver);
  }

  /**
   * Generates the handler for a plugin function (e.g. the setup() function)
   *
   * @param {string} funName The name of the function to make a handler for
   * @param {PromiseType} promiseType The type of promise (WebDriver or Q) that should be used
   * @param {boolean=} failReturnVal The value that the function should return if the plugin crashes
   *
   * @return The handler
   */
  private pluginFunFactory(funName: string, promiseType: PromiseType.Q, failReturnVal?: boolean):
      (...args: any[]) => q.Promise<any[]>;
  private pluginFunFactory(
      funName: string, promiseType: PromiseType.WEBDRIVER,
      failReturnVal?: boolean): (...args: any[]) => webdriver.promise.Promise<any[]>;
  private pluginFunFactory(funName: string, promiseType: PromiseType, failReturnVal?: boolean) {
    return (...args: any[]) => {
      const promises =
          this.pluginObjs.filter(pluginObj => typeof(pluginObj as any)[funName] === 'function')
              .map(
                  pluginObj =>
                      this.safeCallPluginFun(pluginObj, funName, args, promiseType, failReturnVal));
      return promiseType == PromiseType.Q ? q.all(promises) : webdriver.promise.all(promises);
    };
  }
}

export interface SpecResult {
  description: string;
  assertions: AssertionResult[];
}

export interface AssertionResult {
  passed: boolean;
  errorMsg?: string;
  stackTrace?: string;
}
