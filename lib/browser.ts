// Util from NodeJs
import * as net from 'net';
import * as url from 'url';
import * as util from 'util';

import {build$, build$$, ElementArrayFinder, ElementFinder} from './element';
import {ProtractorExpectedConditions} from './expectedConditions';
import {Locator, ProtractorBy} from './locators';
import {Logger} from './logger';
import {Plugins} from './plugins';
import * as helper from './util';

let clientSideScripts = require('./clientsidescripts');
let webdriver = require('selenium-webdriver');
let Command = require('selenium-webdriver/lib/command').Command;
let CommandName = require('selenium-webdriver/lib/command').Name;

// jshint browser: true
/* global angular */

const DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!';
const DEFAULT_RESET_URL = 'data:text/html,<html></html>';
const DEFAULT_GET_PAGE_TIMEOUT = 10000;

let logger = new Logger('protractor');

/*
 * Mix in other webdriver functionality to be accessible via protractor.
 */
for (let foo in webdriver) {
  exports[foo] = webdriver[foo];
}

// Explicitly define webdriver.WebDriver.
export class Webdriver {
  actions: () => webdriver.ActionSequence = webdriver.WebDriver.actions;
  wait:
      (condition: webdriver.promise.Promise<any>|webdriver.util.Condition|
       Function,
       opt_timeout?: number,
       opt_message?:
           string) => webdriver.promise.Promise<any> = webdriver.WebDriver.wait;
  sleep: (ms: number) => webdriver.promise.Promise<any> =
      webdriver.WebDriver.sleep;
  getCurrentUrl:
      () => webdriver.promise.Promise<any> = webdriver.WebDriver.getCurrentUrl;
  getTitle: () => webdriver.promise.Promise<any> = webdriver.WebDriver.getTitle;
  takeScreenshot:
      () => webdriver.promise.Promise<any> = webdriver.WebDriver.takeScreenshot;
}

/**
 * Mix a function from one object onto another. The function will still be
 * called in the context of the original object.  Any arguments of type
 * `ElementFinder` will be unwrapped to their underlying `WebElement` instance
 *
 * @private
 * @param {Object} to
 * @param {Object} from
 * @param {string} fnName
 * @param {function=} setupFn
 */
function ptorMixin(to: any, from: any, fnName: string, setupFn?: Function) {
  to[fnName] = function() {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] instanceof ElementFinder) {
        arguments[i] = arguments[i].getWebElement();
      }
    }
    if (setupFn) {
      setupFn();
    }
    return from[fnName].apply(from, arguments);
  };
};

export interface ElementHelper extends Function {
  (locator: Locator): ElementFinder;
  all?: (locator: Locator) => ElementArrayFinder;
}

/**
 * Build the helper 'element' function for a given instance of Browser.
 *
 * @private
 * @param {Browser} browser A browser instance.
 * @returns {function(webdriver.Locator): ElementFinder}
 */
function buildElementHelper(browser: ProtractorBrowser): ElementHelper {
  let element: ElementHelper = (locator: Locator) => {
    return new ElementArrayFinder(browser).all(locator).toElementFinder_();
  };

  element.all =
      (locator: Locator) => {
        return new ElementArrayFinder(browser).all(locator);
      }

  return element;
};

/**
 * @alias browser
 * @constructor
 * @extends {webdriver.WebDriver}
 * @param {webdriver.WebDriver} webdriver
 * @param {string=} opt_baseUrl A base URL to run get requests against.
 * @param {string=} opt_rootElement  Selector element that has an ng-app in
 *     scope.
 * @param {boolean=} opt_untrackOutstandingTimeouts Whether Protractor should
 *     stop tracking outstanding $timeouts.
 */
export class ProtractorBrowser extends Webdriver {
  /**
   * @type {ProtractorBy}
   */
  static By = new ProtractorBy();

  /**
   * @type {ExpectedConditions}
   */
  static ExpectedConditions = new ProtractorExpectedConditions();

  /**
   * The wrapped webdriver instance. Use this to interact with pages that do
   * not contain Angular (such as a log-in screen).
   *
   * @type {webdriver.WebDriver}
   */
  driver: webdriver.WebDriver;

  /**
   * Helper function for finding elements.
   *
   * @type {function(webdriver.Locator): ElementFinder}
   */
  element: ElementHelper;

  /**
   * Shorthand function for finding elements by css.
   *
   * @type {function(string): ElementFinder}
   */
  $: (query: string) => ElementFinder;

  /**
   * Shorthand function for finding arrays of elements by css.
   *
   * @type {function(string): ElementArrayFinder}
   */
  $$: (query: string) => ElementArrayFinder;

  /**
   * All get methods will be resolved against this base URL. Relative URLs are =
   * resolved the way anchor tags resolve.
   *
   * @type {string}
   */
  baseUrl: string;

  /**
   * The css selector for an element on which to find Angular. This is usually
   * 'body' but if your ng-app is on a subsection of the page it may be
   * a subelement.
   *
   * @type {string}
   */
  rootEl: string;

  /**
   * If true, Protractor will not attempt to synchronize with the page before
   * performing actions. This can be harmful because Protractor will not wait
   * until $timeouts and $http calls have been processed, which can cause
   * tests to become flaky. This should be used only when necessary, such as
   * when a page continuously polls an API using $timeout.
   *
   * @type {boolean}
   */
  ignoreSynchronization: boolean;

  /**
   * Timeout in milliseconds to wait for pages to load when calling `get`.
   *
   * @type {number}
   */
  getPageTimeout: number;

  /**
   * An object that holds custom test parameters.
   *
   * @type {Object}
   */
  params: any;

  /**
   * Set by the runner.
   *
   * @type {q.Promise} Done when the new browser is ready for use
   */
  ready: webdriver.promise.Promise<any>;

  /*
   * Set by the runner.
   *
   * @type {Plugins} Object containing plugin funtions from config.
   */
  plugins_: Plugins;

  /**
   * The reset URL to use between page loads.
   *
   * @type {string}
   */
  resetUrl: string;

  /**
   * If true, Protractor will track outstanding $timeouts and report them in the
   * error message if Protractor fails to synchronize with Angular in time.
   * @private {boolean}
   */
  trackOutstandingTimeouts_: boolean;

  /**
   * If set, will be the universal timeout applied to all tests run by
   * Protractor.
   */
  public allScriptsTimeout: number;

  /**
   * Information about mock modules that will be installed during every
   * get().
   *
   * @type {Array<{name: string, script: function|string, args:
   * Array.<string>}>}
   */
  mockModules_: any[];

  /**
   * If specified, start a debugger server at specified port instead of repl
   * when running element explorer.
   * @private {number}
   */
  debuggerServerPort_: number;

  debuggerValidated_: boolean;


  /**
   * If true, Protractor will interpret any angular apps it comes across as
   * hybrid angular1/angular2 apps.
   *
   * @type {boolean}
   */
  ng12Hybrid: boolean;

  // This index type allows looking up methods by name so we can do mixins.
  [key: string]: any;

  constructor(
      webdriverInstance: webdriver.WebDriver, opt_baseUrl?: string,
      opt_rootElement?: string, opt_untrackOutstandingTimeouts?: boolean) {
    super();
    // These functions should delegate to the webdriver instance, but should
    // wait for Angular to sync up before performing the action. This does not
    // include functions which are overridden by protractor below.
    let methodsToSync = ['getCurrentUrl', 'getPageSource', 'getTitle'];


    // Mix all other driver functionality into Protractor.
    Object.getOwnPropertyNames(webdriver.WebDriver.prototype)
        .forEach((method: string) => {
          if (!this[method] && typeof webdriverInstance[method] == 'function') {
            if (methodsToSync.indexOf(method) !== -1) {
              ptorMixin(
                  this, webdriverInstance, method,
                  this.waitForAngular.bind(this));
            } else {
              ptorMixin(this, webdriverInstance, method);
            }
          }
        });

    this.driver = webdriverInstance;
    this.element = buildElementHelper(this);
    this.$ = build$(this.element, webdriver.By);
    this.$$ = build$$(this.element, webdriver.By);
    this.baseUrl = opt_baseUrl || '';
    this.rootEl = opt_rootElement || 'body';
    this.ignoreSynchronization = false;
    this.getPageTimeout = DEFAULT_GET_PAGE_TIMEOUT;
    this.params = {};
    this.ready = null;
    this.plugins_ = new Plugins({});
    this.resetUrl = DEFAULT_RESET_URL;
    this.ng12Hybrid = false;

    this.driver.getCapabilities().then((caps: webdriver.Capabilities) => {
      // Internet Explorer does not accept data URLs, which are the default
      // reset URL for Protractor.
      // Safari accepts data urls, but SafariDriver fails after one is used.
      // PhantomJS produces a "Detected a page unload event" if we use data urls
      let browserName = caps.get('browserName');
      if (browserName === 'internet explorer' || browserName === 'safari' ||
          browserName === 'phantomjs' || browserName === 'MicrosoftEdge') {
        this.resetUrl = 'about:blank';
      }
    });

    this.trackOutstandingTimeouts_ = !opt_untrackOutstandingTimeouts;
    this.mockModules_ = [];
    this.addBaseMockModules_();
  }

  /**
   * Get the processed configuration object that is currently being run. This
   * will contain the specs and capabilities properties of the current runner
   * instance.
   *
   * Set by the runner.
   *
   * @returns {webdriver.promise.Promise} A promise which resolves to the
   * capabilities object.
   */
  getProcessedConfig(): webdriver.promise.Promise<any> { return null; }

  /**
   * Fork another instance of browser for use in interactive tests.
   *
   * Set by the runner.
   *
   * @param {boolean} opt_useSameUrl Whether to navigate to current url on
   * creation
   * @param {boolean} opt_copyMockModules Whether to apply same mock modules on
   * creation
   * @returns {Browser} A browser instance.
   */
  forkNewDriverInstance(
      opt_useSameUrl?: boolean,
      opt_copyMockModules?: boolean): ProtractorBrowser {
    return null;
  }

  /**
   * Restart the browser instance.
   *
   * Set by the runner.
   */
  restart() { return; }

  /**
   * Instead of using a single root element, search through all angular apps
   * available on the page when finding elements or waiting for stability.
   * Only compatible with Angular2.
   */
  useAllAngular2AppRoots() {
    // The empty string is an invalid css selector, so we use it to easily
    // signal to scripts to not find a root element.
    this.rootEl = '';
  }

  /**
   * The same as {@code webdriver.WebDriver.prototype.executeScript},
   * but with a customized description for debugging.
   *
   * @private
   * @param {!(string|Function)} script The script to execute.
   * @param {string} description A description of the command for debugging.
   * @param {...*} var_args The arguments to pass to the script.
   * @returns {!webdriver.promise.Promise.<T>} A promise that will resolve to
   * the
   *    scripts return value.
   * @template T
   */
  private executeScript_(
      script: string|Function, description: string,
      ...scriptArgs: any[]): webdriver.promise.Promise<any> {
    if (typeof script === 'function') {
      script = 'return (' + script + ').apply(null, arguments);';
    }

    return this.driver.schedule(
        new Command(CommandName.EXECUTE_SCRIPT)
            .setParameter('script', script)
            .setParameter('args', scriptArgs),
        description);
  }

  /**
   * The same as {@code webdriver.WebDriver.prototype.executeAsyncScript},
   * but with a customized description for debugging.
   *
   * @private
   * @param {!(string|Function)} script The script to execute.
   * @param {string} description A description for debugging purposes.
   * @param {...*} var_args The arguments to pass to the script.
   * @returns {!webdriver.promise.Promise.<T>} A promise that will resolve to
   * the
   *    scripts return value.
   * @template T
   */
  private executeAsyncScript_(
      script: string|Function, description: string,
      ...scriptArgs: any[]): webdriver.promise.Promise<any> {
    if (typeof script === 'function') {
      script = 'return (' + script + ').apply(null, arguments);';
    }
    return this.driver.schedule(
        new Command(CommandName.EXECUTE_ASYNC_SCRIPT)
            .setParameter('script', script)
            .setParameter('args', scriptArgs),
        description);
  }

  /**
   * Instruct webdriver to wait until Angular has finished rendering and has
   * no outstanding $http or $timeout calls before continuing.
   * Note that Protractor automatically applies this command before every
   * WebDriver action.
   *
   * @param {string=} opt_description An optional description to be added
   *     to webdriver logs.
   * @returns {!webdriver.promise.Promise} A promise that will resolve to the
   *    scripts return value.
   */
  waitForAngular(opt_description?: string): webdriver.promise.Promise<any> {
    let description = opt_description ? ' - ' + opt_description : '';
    if (this.ignoreSynchronization) {
      return this.driver.controlFlow().execute(() => {
        return true;
      }, 'Ignore Synchronization Protractor.waitForAngular()');
    }

    let runWaitForAngularScript: () => webdriver.promise.Promise<any> = () => {
      if (this.plugins_.skipAngularStability()) {
        return webdriver.promise.fulfilled();
      } else if (this.rootEl) {
        return this.executeAsyncScript_(
            clientSideScripts.waitForAngular,
            'Protractor.waitForAngular()' + description, this.rootEl,
            this.ng12Hybrid);
      } else {
        return this.executeAsyncScript_(
            clientSideScripts.waitForAllAngular2,
            'Protractor.waitForAngular()' + description);
      }
    };

    return runWaitForAngularScript()
        .then((browserErr: Function) => {
          if (browserErr) {
            throw 'Error while waiting for Protractor to ' +
                'sync with the page: ' + JSON.stringify(browserErr);
          }
        })
        .then(
            () => {
              return this.driver.controlFlow()
                  .execute(
                      () => { return this.plugins_.waitForPromise(); },
                      'Plugins.waitForPromise()')
                  .then(() => {
                    return this.driver.wait(() => {
                      return this.plugins_.waitForCondition().then(
                          (results: boolean[]) => {
                            return results.reduce(
                                (x, y) => { return x && y; }, true);
                          });
                    }, this.allScriptsTimeout, 'Plugins.waitForCondition()');
                  });
            },
            (err: Error) => {
              let timeout: RegExpExecArray;
              if (/asynchronous script timeout/.test(err.message)) {
                // Timeout on Chrome
                timeout = /-?[\d\.]*\ seconds/.exec(err.message);
              } else if (/Timed out waiting for async script/.test(
                             err.message)) {
                // Timeout on Firefox
                timeout = /-?[\d\.]*ms/.exec(err.message);
              } else if (/Timed out waiting for an asynchronous script/.test(
                             err.message)) {
                // Timeout on Safari
                timeout = /-?[\d\.]*\ ms/.exec(err.message);
              }
              if (timeout) {
                let errMsg =
                    'Timed out waiting for Protractor to synchronize with ' +
                    'the page after ' + timeout + '. Please see ' +
                    'https://github.com/angular/protractor/blob/master/docs/faq.md';
                if (description.startsWith(' - Locator: ')) {
                  errMsg +=
                      '\nWhile waiting for element with locator' + description;
                }
                let pendingTimeoutsPromise: webdriver.promise.Promise<any>;
                if (this.trackOutstandingTimeouts_) {
                  pendingTimeoutsPromise = this.executeScript_(
                      'return window.NG_PENDING_TIMEOUTS',
                      'Protractor.waitForAngular() - getting pending timeouts' +
                          description);
                } else {
                  pendingTimeoutsPromise = webdriver.promise.fulfilled({});
                }
                let pendingHttpsPromise = this.executeScript_(
                    clientSideScripts.getPendingHttpRequests,
                    'Protractor.waitForAngular() - getting pending https' +
                        description,
                    this.rootEl);

                return webdriver.promise
                    .all([pendingTimeoutsPromise, pendingHttpsPromise])
                    .then(
                        (arr: any[]) => {
                          let pendingTimeouts = arr[0] || [];
                          let pendingHttps = arr[1] || [];

                          let key: string, pendingTasks: string[] = [];
                          for (key in pendingTimeouts) {
                            if (pendingTimeouts.hasOwnProperty(key)) {
                              pendingTasks.push(
                                  ' - $timeout: ' + pendingTimeouts[key]);
                            }
                          }
                          for (key in pendingHttps) {
                            pendingTasks.push(
                                ' - $http: ' + pendingHttps[key].url);
                          }
                          if (pendingTasks.length) {
                            errMsg += '. \nThe following tasks were pending:\n';
                            errMsg += pendingTasks.join('\n');
                          }
                          err.message = errMsg;
                          throw err;
                        },
                        () => {
                          err.message = errMsg;
                          throw err;
                        });
              } else {
                throw err;
              }
            });
  }

  /**
   * Waits for Angular to finish rendering before searching for elements.
   * @see webdriver.WebDriver.findElement
   * @returns {!webdriver.promise.Promise} A promise that will be resolved to
   *      the located {@link webdriver.WebElement}.
   */
  findElement(locator: Locator): webdriver.WebElement {
    return this.element(locator).getWebElement();
  }

  /**
   * Waits for Angular to finish rendering before searching for elements.
   * @see webdriver.WebDriver.findElements
   * @returns {!webdriver.promise.Promise} A promise that will be resolved to an
   *     array of the located {@link webdriver.WebElement}s.
   */
  findElements(locator: Locator): webdriver.promise.Promise<any> {
    return this.element.all(locator).getWebElements();
  }

  /**
   * Tests if an element is present on the page.
   * @see webdriver.WebDriver.isElementPresent
   * @returns {!webdriver.promise.Promise} A promise that will resolve to whether
   *     the element is present on the page.
   */
  isElementPresent(locatorOrElement: webdriver.Locator|
                   webdriver.WebElement): webdriver.promise.Promise<any> {
    let element = (locatorOrElement.isPresent) ? locatorOrElement :
                                                 this.element(locatorOrElement);
    return element.isPresent();
  }

  /**
   * Add a module to load before Angular whenever Protractor.get is called.
   * Modules will be registered after existing modules already on the page,
   * so any module registered here will override preexisting modules with the
   * same
   * name.
   *
   * @example
   * browser.addMockModule('modName', function() {
   *   angular.module('modName', []).value('foo', 'bar');
   * });
   *
   * @param {!string} name The name of the module to load or override.
   * @param {!string|Function} script The JavaScript to load the module.
   *     Note that this will be executed in the browser context, so it cannot
   *     access variables from outside its scope.
   * @param {...*} varArgs Any additional arguments will be provided to
   *     the script and may be referenced using the `arguments` object.
   */
  addMockModule(name: string, script: string|Function, ...moduleArgs: any[]) {
    this.mockModules_.push({name: name, script: script, args: moduleArgs});
  }

  /**
   * Clear the list of registered mock modules.
   */
  clearMockModules() {
    this.mockModules_ = [];
    this.addBaseMockModules_();
  }

  /**
   * Remove a registered mock module.
   *
   * @example
   * browser.removeMockModule('modName');
   *
   * @param {!string} name The name of the module to remove.
   */
  removeMockModule(name: string) {
    for (let i = 0; i < this.mockModules_.length; ++i) {
      if (this.mockModules_[i].name == name) {
        this.mockModules_.splice(i--, 1);
      }
    }
  }

  /**
   * Get a list of the current mock modules.
   *
   * @returns {Array.<!string|Function>} The list of mock modules.
   */
  getRegisteredMockModules(): Array<string|Function> {
    return this.mockModules_.map((module) => { return module.script; });
  };

  /**
   * Add the base mock modules used for all Protractor tests.
   *
   * @private
   */
  private addBaseMockModules_() {
    this.addMockModule(
        'protractorBaseModule_', (trackOutstandingTimeouts: boolean) => {
          let ngMod = angular.module('protractorBaseModule_', []).config([
            '$compileProvider',
            ($compileProvider: any) => {
              if ($compileProvider.debugInfoEnabled) {
                $compileProvider.debugInfoEnabled(true);
              }
            }
          ]);
          if (trackOutstandingTimeouts) {
            ngMod.config([
              '$provide',
              ($provide: any) => {
                $provide.decorator('$timeout', [
                  '$delegate',
                  ($delegate: any) => {
                    let $timeout = $delegate;

                    let taskId = 0;
                    if (!window['NG_PENDING_TIMEOUTS']) {
                      window['NG_PENDING_TIMEOUTS'] = {};
                    }

                    let extendedTimeout: any = function() {
                      let args = Array.prototype.slice.call(arguments);
                      if (typeof(args[0]) !== 'function') {
                        return $timeout.apply(null, args);
                      }

                      taskId++;
                      let fn = args[0];
                      window['NG_PENDING_TIMEOUTS'][taskId] = fn.toString();
                      let wrappedFn = ((taskId_: number) => {
                        return function() {
                          delete window['NG_PENDING_TIMEOUTS'][taskId_];
                          return fn.apply(null, arguments);
                        };
                      })(taskId);
                      args[0] = wrappedFn;

                      let promise = $timeout.apply(null, args);
                      promise.ptorTaskId_ = taskId;
                      return promise;
                    };

                    extendedTimeout.cancel = function() {
                      let taskId_ = arguments[0] && arguments[0].ptorTaskId_;
                      if (taskId_) {
                        delete window['NG_PENDING_TIMEOUTS'][taskId_];
                      }
                      return $timeout.cancel.apply($timeout, arguments);
                    };

                    return extendedTimeout;
                  }
                ]);
              }
            ]);
          }
        }, this.trackOutstandingTimeouts_);
  }

  /**
   * @see webdriver.WebDriver.get
   *
   * Navigate to the given destination and loads mock modules before
   * Angular. Assumes that the page being loaded uses Angular.
   * If you need to access a page which does not have Angular on load, use
   * the wrapped webdriver directly.
   *
   * @example
   * browser.get('https://angularjs.org/');
   * expect(browser.getCurrentUrl()).toBe('https://angularjs.org/');
   *
   * @param {string} destination Destination URL.
   * @param {number=} opt_timeout Number of milliseconds to wait for Angular to
   *     start.
   */
  get(destination: string, opt_timeout?: number) {
    let timeout = opt_timeout ? opt_timeout : this.getPageTimeout;

    destination = this.baseUrl.indexOf('file://') === 0 ?
        this.baseUrl + destination :
        url.resolve(this.baseUrl, destination);
    let msg = (str: string) => {
      return 'Protractor.get(' + destination + ') - ' + str;
    };

    if (this.ignoreSynchronization) {
      this.driver.get(destination);
      return this.driver.controlFlow().execute(
          () => { return this.plugins_.onPageLoad(); });
    }

    let deferred = webdriver.promise.defer();

    this.driver.get(this.resetUrl).then(null, deferred.reject);
    this.executeScript_(
            'window.name = "' + DEFER_LABEL + '" + window.name;' +

                'window.location.replace("' + destination + '");',
            msg('reset url'))
        .then(null, deferred.reject);

    // We need to make sure the new url has loaded before
    // we try to execute any asynchronous scripts.
    this.driver
        .wait(
            () => {
              return this
                  .executeScript_(
                      'return window.location.href;', msg('get url'))
                  .then(
                      (url: any) => { return url !== this.resetUrl; },
                      (err: webdriver.ErrorCode) => {
                        if (err.code == 13) {
                          // Ignore the error, and continue trying. This is
                          // because IE
                          // driver sometimes (~1%) will throw an unknown error
                          // from this
                          // execution. See
                          // https://github.com/angular/protractor/issues/841
                          // This shouldn't mask errors because it will fail
                          // with the timeout
                          // anyway.
                          return false;
                        } else {
                          throw err;
                        }
                      });
            },
            timeout, 'waiting for page to load for ' + timeout + 'ms')
        .then(null, deferred.reject);

    this.driver.controlFlow().execute(
        () => { return this.plugins_.onPageLoad(); });

    // Make sure the page is an Angular page.
    this.executeAsyncScript_(
            clientSideScripts.testForAngular, msg('test for angular'),
            Math.floor(timeout / 1000), this.ng12Hybrid)
        .then(
            (angularTestResult: {ver: string, message: string}) => {
              let angularVersion = angularTestResult.ver;
              if (!angularVersion) {
                let message = angularTestResult.message;
                throw new Error(
                    'Angular could not be found on the page ' + destination +
                    ' : ' + message);
              }
              return angularVersion;
            },
            (err: Error) => {
              throw 'Error while running testForAngular: ' + err.message;
            })
        .then(loadMocks, deferred.reject);

    let self = this;
    function loadMocks(angularVersion: number) {
      if (angularVersion === 1) {
        // At this point, Angular will pause for us until
        // angular.resumeBootstrap
        // is called.
        let moduleNames: string[] = [];
        for (let i = 0; i < self.mockModules_.length; ++i) {
          let mockModule = self.mockModules_[i];
          let name = mockModule.name;
          moduleNames.push(name);
          let executeScriptArgs = [
            mockModule.script, msg('add mock module ' + name)
          ].concat(mockModule.args);
          self.executeScript_.apply(self, executeScriptArgs)
              .then(
                  null,
                  (err: Error) => {
                    throw 'Error while running module script ' + name + ': ' +
                        err.message;
                  })
              .then(null, deferred.reject);
        }

        self.executeScript_(
                'angular.resumeBootstrap(arguments[0]);',
                msg('resume bootstrap'), moduleNames)
            .then(null, deferred.reject);
      } else {
        // TODO: support mock modules in Angular2. For now, error if someone
        // has tried to use one.
        if (self.mockModules_.length > 1) {
          deferred.reject(
              'Trying to load mock modules on an Angular2 app ' +
              'is not yet supported.');
        }
      }
    }

    this.driver.controlFlow().execute(() => {
      return self.plugins_.onPageStable().then(
          () => { deferred.fulfill(); },
          (error: Error) => { deferred.reject(error); });
    });

    return deferred.promise;
  }

  /**
   * @see webdriver.WebDriver.refresh
   *
   * Makes a full reload of the current page and loads mock modules before
   * Angular. Assumes that the page being loaded uses Angular.
   * If you need to access a page which does not have Angular on load, use
   * the wrapped webdriver directly.
   *
   * @param {number=} opt_timeout Number of milliseconds to wait for Angular to start.
   */
  refresh(opt_timeout?: number) {
    if (this.ignoreSynchronization) {
      return this.driver.navigate().refresh();
    }

    return this
        .executeScript_(
            'return window.location.href', 'Protractor.refresh() - getUrl')
        .then((href: string) => { return this.get(href, opt_timeout); });
  }

  /**
   * Mixin navigation methods back into the navigation object so that
   * they are invoked as before, i.e. driver.navigate().refresh()
   */
  navigate() {
    let nav = this.driver.navigate();
    ptorMixin(nav, this, 'refresh');
    return nav;
  }

  /**
   * Browse to another page using in-page navigation.
   *
   * @example
   * browser.get('http://angular.github.io/protractor/#/tutorial');
   * browser.setLocation('api');
   * expect(browser.getCurrentUrl())
   *     .toBe('http://angular.github.io/protractor/#/api');
   *
   * @param {string} url In page URL using the same syntax as $location.url()
   * @returns {!webdriver.promise.Promise} A promise that will resolve once
   *    page has been changed.
   */
  setLocation(url: string): webdriver.promise.Promise<any> {
    this.waitForAngular();
    return this
        .executeScript_(
            clientSideScripts.setLocation, 'Protractor.setLocation()',
            this.rootEl, url)
        .then((browserErr: Error) => {
          if (browserErr) {
            throw 'Error while navigating to \'' + url + '\' : ' +
                JSON.stringify(browserErr);
          }
        });
  }

  /**
   * Returns the current absolute url from AngularJS.
   *
   * @example
   * browser.get('http://angular.github.io/protractor/#/api');
   * expect(browser.getLocationAbsUrl())
   *     .toBe('http://angular.github.io/protractor/#/api');
   * @returns {webdriver.promise.Promise<string>} The current absolute url from
   * AngularJS.
   */
  getLocationAbsUrl(): webdriver.promise.Promise<any> {
    this.waitForAngular();
    return this.executeScript_(
        clientSideScripts.getLocationAbsUrl, 'Protractor.getLocationAbsUrl()',
        this.rootEl);
  }

  /**
   * Adds a task to the control flow to pause the test and inject helper
   * functions
   * into the browser, so that debugging may be done in the browser console.
   *
   * This should be used under node in debug mode, i.e. with
   * protractor debug <configuration.js>
   *
   * @example
   * While in the debugger, commands can be scheduled through webdriver by
   * entering the repl:
   *   debug> repl
   *   > element(by.input('user')).sendKeys('Laura');
   *   > browser.debugger();
   *   Press Ctrl + c to leave debug repl
   *   debug> c
   *
   * This will run the sendKeys command as the next task, then re-enter the
   * debugger.
   */
  debugger() {
    // jshint debug: true
    this.driver.executeScript(clientSideScripts.installInBrowser);
    webdriver.promise.controlFlow().execute(
        () => { debugger; }, 'add breakpoint to control flow');
  }

  /**
   * Validates that the port is free to use. This will only validate the first
   * time it is called. The reason is that on subsequent calls, the port will
   * already be bound to the debugger, so it will not be available, but that is
   * okay.
   *
   * @returns {Promise<boolean>} A promise that becomes ready when the
   * validation
   *     is done. The promise will resolve to a boolean which represents whether
   *     this is the first time that the debugger is called.
   */
  private validatePortAvailability_(port: number):
      webdriver.promise.Promise<any> {
    if (this.debuggerValidated_) {
      return webdriver.promise.fulfilled(false);
    }

    let doneDeferred = webdriver.promise.defer();

    // Resolve doneDeferred if port is available.
    let tester = net.connect({port: port}, () => {
      doneDeferred.reject(
          'Port ' + port + ' is already in use. Please specify ' +
          'another port to debug.');
    });
    tester.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ECONNREFUSED') {
        tester.once('close', () => { doneDeferred.fulfill(true); }).end();
      } else {
        doneDeferred.reject(
            'Unexpected failure testing for port ' + port + ': ' +
            JSON.stringify(err));
      }
    });

    return doneDeferred.then(null, (err: string) => {
      console.error(err);
      process.exit(1);
    });
  }

  private dbgCodeExecutor_: any;
  /**
   * Helper function to:
   *  1) Set up helper functions for debugger clients to call on (e.g.
   *     getControlFlowText, execute code, get autocompletion).
   *  2) Enter process into debugger mode. (i.e. process._debugProcess).
   *  3) Invoke the debugger client specified by debuggerClientPath.
   *
   * @param {string} debuggerClientPath Absolute path of debugger client to use
   * @param {Function} onStartFn Function to call when the debugger starts. The
   *     function takes a single parameter, which represents whether this is the
   *     first time that the debugger is called.
   * @param {number=} opt_debugPort Optional port to use for the debugging
   * process
   */
  private initDebugger_(
      debuggerClientPath: string, onStartFn: Function, opt_debugPort?: number) {
    // Patch in a function to help us visualize what's going on in the control
    // flow.
    webdriver.promise.ControlFlow.prototype.getControlFlowText = function() {
      let controlFlowText = this.getSchedule(/* opt_includeStackTraces */ true);
      // This filters the entire control flow text, not just the stack trace, so
      // unless we maintain a good (i.e. non-generic) set of keywords in
      // STACK_SUBSTRINGS_TO_FILTER, we run the risk of filtering out non stack
      // trace. The alternative though, which is to reimplement
      // webdriver.promise.ControlFlow.prototype.getSchedule() here is much
      // hackier, and involves messing with the control flow's internals /
      // private
      // variables.
      return helper.filterStackTrace(controlFlowText);
    };

    let vm_ = require('vm');
    let flow = webdriver.promise.controlFlow();

    let context: Object = {require: require};
    global.list = (locator: Locator) => {
      /* globals browser */
      return global.browser.findElements(locator).then(
          (arr: webdriver.WebElement[]) => {
            let found: string[] = [];
            for (let i = 0; i < arr.length; ++i) {
              arr[i].getText().then((text: string) => { found.push(text); });
            }
            return found;
          });
    };
    for (let key in global) {
      context[key] = global[key];
    }
    let sandbox = vm_.createContext(context);

    let browserUnderDebug = this;
    let debuggerReadyPromise = webdriver.promise.defer();
    flow.execute(function() {
      process['debugPort'] = opt_debugPort || process['debugPort'];
      browserUnderDebug.validatePortAvailability_(process['debugPort'])
          .then(function(firstTime: boolean) {
            onStartFn(firstTime);

            let args = [process.pid, process['debugPort']];
            if (browserUnderDebug.debuggerServerPort_) {
              args.push(browserUnderDebug.debuggerServerPort_);
            }
            let nodedebug =
                require('child_process').fork(debuggerClientPath, args);
            process.on('exit', function() { nodedebug.kill('SIGTERM'); });
            nodedebug.on('message', function(m: string) {
              if (m === 'ready') {
                debuggerReadyPromise.fulfill();
              }
            });
          });
    });

    let pausePromise = flow.execute(function() {
      return debuggerReadyPromise.then(function() {
        // Necessary for backward compatibility with node < 0.12.0
        return browserUnderDebug.executeScript_('', 'empty debugger hook');
      });
    });

    // Helper used only by debuggers at './debugger/modes/*.js' to insert code
    // into the control flow.
    // In order to achieve this, we maintain a promise at the top of the control
    // flow, so that we can insert frames into it.
    // To be able to simulate callback/asynchronous code, we poll this object
    // for an result at every run of DeferredExecutor.execute.
    this.dbgCodeExecutor_ = {
      execPromise_: pausePromise,  // Promise pointing to current stage of flow.
      execPromiseResult_: undefined,  // Return value of promise.
      execPromiseError_: undefined,   // Error from promise.

      // A dummy repl server to make use of its completion function.
      replServer_: require('repl').start({
        input: {
          on: function() {},
          resume: function() {}
        },                               // dummy readable stream
        output: {write: function() {}},  // dummy writable stream
        useGlobal: true
      }),

      // Execute a function, which could yield a value or a promise,
      // and allow its result to be accessed synchronously
      execute_: function(execFn_: Function) {
        this.execPromiseResult_ = this.execPromiseError_ = undefined;

        this.execPromise_ = this.execPromise_.then(execFn_).then(
            (result: Object) => { this.execPromiseResult_ = result; },
            (err: Error) => { this.execPromiseError_ = err; });

        // This dummy command is necessary so that the DeferredExecutor.execute
        // break point can find something to stop at instead of moving on to the
        // next real command.
        this.execPromise_.then(() => {
          return browserUnderDebug.executeScript_('', 'empty debugger hook');
        });
      },

      // Execute a piece of code.
      // Result is a string representation of the evaluation.
      execute: function(code: Function) {
        let execFn_ = () => {
          // Run code through vm so that we can maintain a local scope which is
          // isolated from the rest of the execution.
          let res = vm_.runInContext(code, sandbox);
          if (!webdriver.promise.isPromise(res)) {
            res = webdriver.promise.fulfilled(res);
          }

          return res.then((res: any) => {
            if (res === undefined) {
              return undefined;
            } else {
              // The '' forces res to be expanded into a string instead of just
              // '[Object]'. Then we remove the extra space caused by the ''
              // using
              // substring.
              return util.format.apply(this, ['', res]).substring(1);
            }
          });
        };
        this.execute_(execFn_);
      },

      // Autocomplete for a line.
      // Result is a JSON representation of the autocomplete response.
      complete: function(line: string) {
        let execFn_ = () => {
          let deferred = webdriver.promise.defer();
          this.replServer_.complete(line, (err: any, res: any) => {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.fulfill(JSON.stringify(res));
            }
          });
          return deferred;
        };
        this.execute_(execFn_);
      },

      // Code finished executing.
      resultReady: function() { return !this.execPromise_.isPending(); },

      // Get asynchronous results synchronously.
      // This will throw if result is not ready.
      getResult: function() {
        if (!this.resultReady()) {
          throw new Error('Result not ready');
        }
        if (this.execPromiseError_) {
          throw this.execPromiseError_;
        }
        return this.execPromiseResult_;
      }
    };
  }

  /**
   * Beta (unstable) enterRepl function for entering the repl loop from
   * any point in the control flow. Use browser.enterRepl() in your test.
   * Does not require changes to the command line (no need to add 'debug').
   * Note, if you are wrapping your own instance of Protractor, you must
   * expose globals 'browser' and 'protractor' for pause to work.
   *
   * @example
   * element(by.id('foo')).click();
   * browser.enterRepl();
   * // Execution will stop before the next click action.
   * element(by.id('bar')).click();
   *
   * @param {number=} opt_debugPort Optional port to use for the debugging
   * process
   */
  enterRepl(opt_debugPort?: number) {
    let debuggerClientPath = __dirname + '/debugger/clients/explorer.js';
    let onStartFn = () => {
      logger.info();
      logger.info('------- Element Explorer -------');
      logger.info(
          'Starting WebDriver debugger in a child process. Element ' +
          'Explorer is still beta, please report issues at ' +
          'github.com/angular/protractor');
      logger.info();
      logger.info('Type <tab> to see a list of locator strategies.');
      logger.info(
          'Use the `list` helper function to find elements by strategy:');
      logger.info('  e.g., list(by.binding(\'\')) gets all bindings.');
      logger.info();
    };
    this.initDebugger_(debuggerClientPath, onStartFn, opt_debugPort);
  }

  /**
   * Beta (unstable) pause function for debugging webdriver tests. Use
   * browser.pause() in your test to enter the protractor debugger from that
   * point in the control flow.
   * Does not require changes to the command line (no need to add 'debug').
   * Note, if you are wrapping your own instance of Protractor, you must
   * expose globals 'browser' and 'protractor' for pause to work.
   *
   * @example
   * element(by.id('foo')).click();
   * browser.pause();
   * // Execution will stop before the next click action.
   * element(by.id('bar')).click();
   *
   * @param {number=} opt_debugPort Optional port to use for the debugging
   * process
   */
  pause(opt_debugPort?: number) {
    let debuggerClientPath = __dirname + '/debugger/clients/wddebugger.js';
    let onStartFn = (firstTime: boolean) => {
      logger.info();
      logger.info('Encountered browser.pause(). Attaching debugger...');
      if (firstTime) {
        logger.info();
        logger.info('------- WebDriver Debugger -------');
        logger.info(
            'Starting WebDriver debugger in a child process. Pause is ' +
            'still beta, please report issues at github.com/angular/protractor');
        logger.info();
        logger.info('press c to continue to the next webdriver command');
        logger.info('press ^D to detach debugger and resume code execution');
        logger.info('type "repl" to enter interactive mode');
        logger.info('type "exit" to break out of interactive mode');
        logger.info();
      }
    };
    this.initDebugger_(debuggerClientPath, onStartFn, opt_debugPort);
  }

  /**
   * Create a new instance of Browser by wrapping a webdriver instance.
   *
   * @param {webdriver.WebDriver} webdriver The configured webdriver instance.
   * @param {string=} opt_baseUrl A URL to prepend to relative gets.
   * @param {boolean=} opt_untrackOutstandingTimeouts Whether Browser should
   *     stop tracking outstanding $timeouts.
   * @returns {Browser} a new Browser instance
   */
  static wrapDriver(
      webdriver: webdriver.WebDriver, baseUrl?: string, rootElement?: string,
      untrackOutstandingTimeouts?: boolean): ProtractorBrowser {
    return new ProtractorBrowser(
        webdriver, baseUrl, rootElement, untrackOutstandingTimeouts);
  }
}
