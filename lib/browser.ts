import {BPClient} from 'blocking-proxy';
import {ActionSequence, By, Capabilities, Command as WdCommand, FileDetector, ICommandName, Options, promise as wdpromise, Session, TargetLocator, TouchSequence, until, WebDriver, WebElement} from 'selenium-webdriver';
import * as url from 'url';
import {extend as extendWD, ExtendedWebDriver} from 'webdriver-js-extender';

import {DebugHelper} from './debugger';
import {build$, build$$, ElementArrayFinder, ElementFinder} from './element';
import {IError} from './exitCodes';
import {ProtractorExpectedConditions} from './expectedConditions';
import {Locator, ProtractorBy} from './locators';
import {Logger} from './logger';
import {Plugins} from './plugins';

const clientSideScripts = require('./clientsidescripts');
// TODO: fix the typings for selenium-webdriver/lib/command
const Command = require('selenium-webdriver/lib/command').Command as typeof WdCommand;
const CommandName = require('selenium-webdriver/lib/command').Name as ICommandName;

// jshint browser: true

const DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!';
const DEFAULT_RESET_URL = 'data:text/html,<html></html>';
const DEFAULT_GET_PAGE_TIMEOUT = 10000;

let logger = new Logger('protractor');

// TODO(cnishina): either remove for loop entirely since this does not export anything
// the user might need since everything is composed (with caveat that this could be a
// potential breaking change) or export the types with `export * from 'selenium-webdriver'`;
/*
 * Mix in other webdriver functionality to be accessible via protractor.
 */
for (let foo in require('selenium-webdriver')) {
  exports[foo] = require('selenium-webdriver')[foo];
}

// Explicitly define webdriver.WebDriver
// TODO: extend WebDriver from selenium-webdriver typings
export class AbstractWebDriver {
  actions: () => ActionSequence;
  call:
      (fn: (...var_args: any[]) => any, opt_scope?: any,
       ...var_args: any[]) => wdpromise.Promise<any>;
  close: () => void;
  controlFlow: () => wdpromise.ControlFlow;
  executeScript: (script: string|Function, ...var_args: any[]) => wdpromise.Promise<any>;
  executeAsyncScript: (script: string|Function, ...var_args: any[]) => wdpromise.Promise<any>;
  getCapabilities: () => wdpromise.Promise<Capabilities>;
  getCurrentUrl: () => wdpromise.Promise<string>;
  getPageSource: () => wdpromise.Promise<string>;
  getSession: () => wdpromise.Promise<Session>;
  getTitle: () => wdpromise.Promise<string>;
  getWindowHandle: () => wdpromise.Promise<string>;
  getAllWindowHandles: () => wdpromise.Promise<string[]>;
  manage: () => Options;
  quit: () => void;
  schedule: (command: WdCommand, description: string) => wdpromise.Promise<any>;
  setFileDetector: (detector: FileDetector) => void;
  sleep: (ms: number) => wdpromise.Promise<void>;
  switchTo: () => TargetLocator;
  takeScreenshot: () => wdpromise.Promise<any>;
  touchActions: () => TouchSequence;
  wait:
      (condition: wdpromise.Promise<any>|until.Condition<any>|Function, opt_timeout?: number,
       opt_message?: string) => wdpromise.Promise<any>;
}

export class AbstractExtendedWebDriver extends AbstractWebDriver {
  getNetworkConnection: () => wdpromise.Promise<number>;
  setNetworkConnection: (type: number) => wdpromise.Promise<void>;
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
    for (let i = 0; i < arguments.length; i++) {
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
  all: (locator: Locator) => ElementArrayFinder;
}

/**
 * Build the helper 'element' function for a given instance of Browser.
 *
 * @private
 * @param {Browser} browser A browser instance.
 * @returns {function(webdriver.Locator): ElementFinder}
 */
function buildElementHelper(browser: ProtractorBrowser): ElementHelper {
  let element = ((locator: Locator) => {
    return new ElementArrayFinder(browser).all(locator).toElementFinder_();
  }) as ElementHelper;

  element.all = (locator: Locator) => {
    return new ElementArrayFinder(browser).all(locator);
  };

  return element;
};

/**
 * @alias browser
 * @constructor
 * @extends {webdriver_extensions.ExtendedWebDriver}
 * @param {webdriver.WebDriver} webdriver
 * @param {string=} opt_baseUrl A base URL to run get requests against.
 * @param {string=} opt_rootElement  Selector element that has an ng-app in
 *     scope.
 * @param {boolean=} opt_untrackOutstandingTimeouts Whether Protractor should
 *     stop tracking outstanding $timeouts.
 */
export class ProtractorBrowser extends AbstractExtendedWebDriver {
  /**
   * @type {ProtractorBy}
   */
  static By = new ProtractorBy();

  /**
   * @type {ExpectedConditions}
   */
  ExpectedConditions: ProtractorExpectedConditions;

  /**
   * The wrapped webdriver instance. Use this to interact with pages that do
   * not contain Angular (such as a log-in screen).
   *
   * @type {webdriver_extensions.ExtendedWebDriver}
   */
  driver: ExtendedWebDriver;

  /**
   * The client used to control the BlockingProxy. If unset, BlockingProxy is
   * not being used and Protractor will handle client-side synchronization.
   */
  bpClient: BPClient;

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
   * This property is deprecated - please use waitForAngularEnabled instead.
   *
   * @deprecated
   * @type {boolean}
   */
  set ignoreSynchronization(value) {
    this.driver.controlFlow().execute(() => {
      if (this.bpClient) {
        logger.debug('Setting waitForAngular' + value);
        this.bpClient.setSynchronization(!value);
      }
    }, `Set proxy synchronization to ${value}`);
    this.internalIgnoreSynchronization = value;
  }

  get ignoreSynchronization() {
    return this.internalIgnoreSynchronization;
  }

  internalIgnoreSynchronization: boolean;

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
  ready: wdpromise.Promise<any>;

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
  mockModules_: {name: string, script: string|Function, args: any[]}[];

  /**
   * If specified, start a debugger server at specified port instead of repl
   * when running element explorer.
   * @public {number}
   */
  public debuggerServerPort: number;

  /**
   * If true, Protractor will interpret any angular apps it comes across as
   * hybrid angular1/angular2 apps.
   *
   * @type {boolean}
   */
  ng12Hybrid: boolean;

  /**
   * A helper that manages debugging tests.
   */
  debugHelper: DebugHelper;

  // This index type allows looking up methods by name so we can do mixins.
  [key: string]: any;

  constructor(
      webdriverInstance: WebDriver, opt_baseUrl?: string, opt_rootElement?: string,
      opt_untrackOutstandingTimeouts?: boolean, opt_blockingProxyUrl?: string) {
    super();
    // These functions should delegate to the webdriver instance, but should
    // wait for Angular to sync up before performing the action. This does not
    // include functions which are overridden by protractor below.
    let methodsToSync = ['getCurrentUrl', 'getPageSource', 'getTitle'];
    let extendWDInstance: ExtendedWebDriver;
    try {
      extendWDInstance = extendWD(webdriverInstance);
    } catch (e) {
      // Probably not a driver that can be extended (e.g. gotten using
      // `directConnect: true` in the config)
      extendWDInstance = webdriverInstance as ExtendedWebDriver;
    }

    // Mix all other driver functionality into Protractor.
    Object.getOwnPropertyNames(WebDriver.prototype).forEach(method => {
      if (!this[method] && typeof(extendWDInstance as any)[method] === 'function') {
        if (methodsToSync.indexOf(method) !== -1) {
          ptorMixin(this, extendWDInstance, method, this.waitForAngular.bind(this));
        } else {
          ptorMixin(this, extendWDInstance, method);
        }
      }
    });

    this.driver = extendWDInstance;
    if (opt_blockingProxyUrl) {
      logger.info('Starting BP client for ' + opt_blockingProxyUrl);
      this.bpClient = new BPClient(opt_blockingProxyUrl);
    }
    this.element = buildElementHelper(this);
    this.$ = build$(this.element, By);
    this.$$ = build$$(this.element, By);
    this.baseUrl = opt_baseUrl || '';
    this.rootEl = opt_rootElement || 'body';
    this.ignoreSynchronization = false;
    this.getPageTimeout = DEFAULT_GET_PAGE_TIMEOUT;
    this.params = {};
    this.ready = null;
    this.plugins_ = new Plugins({});
    this.resetUrl = DEFAULT_RESET_URL;
    this.ng12Hybrid = false;
    this.debugHelper = new DebugHelper(this);

    this.driver.getCapabilities().then((caps: Capabilities) => {
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

    // set up expected conditions
    this.ExpectedConditions = new ProtractorExpectedConditions(this);
  }

  /**
   * If set to false, Protractor will not wait for Angular $http and $timeout
   * tasks to complete before interacting with the browser. This can cause
   * flaky tests, but should be used if, for instance, your app continuously
   * polls an API with $timeout.
   *
   * Call waitForAngularEnabled() without passing a value to read the current
   * state without changing it.
   */
  waitForAngularEnabled(enabled: boolean = null): boolean {
    if (enabled != null) {
      this.ignoreSynchronization = !enabled;
    }
    return !this.ignoreSynchronization;
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
  getProcessedConfig(): wdpromise.Promise<any> {
    return null;
  }

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
  forkNewDriverInstance(opt_useSameUrl?: boolean, opt_copyMockModules?: boolean):
      ProtractorBrowser {
    return null;
  }

  /**
   * Restart the browser instance.
   *
   * Set by the runner.
   */
  restart() {
    return;
  }

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
   * the scripts return value.
   * @template T
   */
  public executeScriptWithDescription(
      script: string|Function, description: string, ...scriptArgs: any[]): wdpromise.Promise<any> {
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
  private executeAsyncScript_(script: string|Function, description: string, ...scriptArgs: any[]):
      wdpromise.Promise<any> {
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
  waitForAngular(opt_description?: string): wdpromise.Promise<any> {
    let description = opt_description ? ' - ' + opt_description : '';
    if (this.ignoreSynchronization) {
      return this.driver.controlFlow().execute(() => {
        return true;
      }, 'Ignore Synchronization Protractor.waitForAngular()');
    }

    let runWaitForAngularScript: () => wdpromise.Promise<any> = () => {
      if (this.plugins_.skipAngularStability() || this.bpClient) {
        return wdpromise.fulfilled();
      } else if (this.rootEl) {
        return this.executeAsyncScript_(
            clientSideScripts.waitForAngular, 'Protractor.waitForAngular()' + description,
            this.rootEl, this.ng12Hybrid);
      } else {
        return this.executeAsyncScript_(
            clientSideScripts.waitForAllAngular2, 'Protractor.waitForAngular()' + description);
      }
    };

    return runWaitForAngularScript()
        .then((browserErr: Function) => {
          if (browserErr) {
            throw new Error(
                'Error while waiting for Protractor to ' +
                'sync with the page: ' + JSON.stringify(browserErr));
          }
        })
        .then(
            () => {
              return this.driver.controlFlow()
                  .execute(
                      () => {
                        return this.plugins_.waitForPromise();
                      },
                      'Plugins.waitForPromise()')
                  .then(() => {
                    return this.driver.wait(() => {
                      return this.plugins_.waitForCondition().then((results: boolean[]) => {
                        return results.reduce((x, y) => x && y, true);
                      });
                    }, this.allScriptsTimeout, 'Plugins.waitForCondition()');
                  });
            },
            (err: Error) => {
              let timeout: RegExpExecArray;
              if (/asynchronous script timeout/.test(err.message)) {
                // Timeout on Chrome
                timeout = /-?[\d\.]*\ seconds/.exec(err.message);
              } else if (/Timed out waiting for async script/.test(err.message)) {
                // Timeout on Firefox
                timeout = /-?[\d\.]*ms/.exec(err.message);
              } else if (/Timed out waiting for an asynchronous script/.test(err.message)) {
                // Timeout on Safari
                timeout = /-?[\d\.]*\ ms/.exec(err.message);
              }
              if (timeout) {
                let errMsg = `Timed out waiting for asynchronous Angular tasks to finish after ` +
                    `${timeout}. This may be because the current page is not an Angular ` +
                    `application. Please see the FAQ for more details: ` +
                    `https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular`;
                if (description.indexOf(' - Locator: ') == 0) {
                  errMsg += '\nWhile waiting for element with locator' + description;
                }
                let pendingTimeoutsPromise: wdpromise.Promise<any>;
                if (this.trackOutstandingTimeouts_) {
                  pendingTimeoutsPromise = this.executeScriptWithDescription(
                      'return window.NG_PENDING_TIMEOUTS',
                      'Protractor.waitForAngular() - getting pending timeouts' + description);
                } else {
                  pendingTimeoutsPromise = wdpromise.fulfilled({});
                }
                let pendingHttpsPromise = this.executeScriptWithDescription(
                    clientSideScripts.getPendingHttpRequests,
                    'Protractor.waitForAngular() - getting pending https' + description,
                    this.rootEl);

                return wdpromise.all([pendingTimeoutsPromise, pendingHttpsPromise])
                    .then(
                        (arr: any[]) => {
                          let pendingTimeouts = arr[0] || [];
                          let pendingHttps = arr[1] || [];

                          let key: string, pendingTasks: string[] = [];
                          for (key in pendingTimeouts) {
                            if (pendingTimeouts.hasOwnProperty(key)) {
                              pendingTasks.push(' - $timeout: ' + pendingTimeouts[key]);
                            }
                          }
                          for (key in pendingHttps) {
                            pendingTasks.push(' - $http: ' + pendingHttps[key].url);
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
  findElement(locator: Locator): WebElement {
    return this.element(locator).getWebElement();
  }

  /**
   * Waits for Angular to finish rendering before searching for elements.
   * @see webdriver.WebDriver.findElements
   * @returns {!webdriver.promise.Promise} A promise that will be resolved to an
   *     array of the located {@link webdriver.WebElement}s.
   */
  findElements(locator: Locator): wdpromise.Promise<any> {
    return this.element.all(locator).getWebElements();
  }

  /**
   * Tests if an element is present on the page.
   * @see webdriver.WebDriver.isElementPresent
   * @returns {!webdriver.promise.Promise} A promise that will resolve to whether
   *     the element is present on the page.
   */
  isElementPresent(locatorOrElement: ProtractorBy|WebElement): wdpromise.Promise<any> {
    let element =
        ((locatorOrElement as any).isPresent) ? locatorOrElement : this.element(locatorOrElement);
    return (element as any).isPresent();
  }

  /**
   * Add a module to load before Angular whenever Protractor.get is called.
   * Modules will be registered after existing modules already on the page,
   * so any module registered here will override preexisting modules with the
   * same name.
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
    return this.mockModules_.map(module => module.script);
  };

  /**
   * Add the base mock modules used for all Protractor tests.
   *
   * @private
   */
  private addBaseMockModules_() {
    this.addMockModule(
        'protractorBaseModule_', clientSideScripts.protractorBaseModuleFn,
        this.trackOutstandingTimeouts_);
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
  get(destination: string, timeout = this.getPageTimeout) {
    destination = this.baseUrl.indexOf('file://') === 0 ? this.baseUrl + destination :
                                                          url.resolve(this.baseUrl, destination);
    let msg = (str: string) => {
      return 'Protractor.get(' + destination + ') - ' + str;
    };

    if (this.bpClient) {
      this.driver.controlFlow().execute(() => {
        return this.bpClient.setSynchronization(false);
      });
    }

    if (this.ignoreSynchronization) {
      this.driver.get(destination);
      return this.driver.controlFlow().execute(() => this.plugins_.onPageLoad()).then(() => {});
    }

    let deferred = wdpromise.defer<void>();

    this.driver.get(this.resetUrl).then(null, deferred.reject);
    this.executeScriptWithDescription(
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
                  .executeScriptWithDescription('return window.location.href;', msg('get url'))
                  .then(
                      (url: any) => {
                        return url !== this.resetUrl;
                      },
                      (err: IError) => {
                        if (err.code == 13) {
                          // Ignore the error, and continue trying. This is
                          // because IE driver sometimes (~1%) will throw an
                          // unknown error from this execution. See
                          // https://github.com/angular/protractor/issues/841
                          // This shouldn't mask errors because it will fail
                          // with the timeout anyway.
                          return false;
                        } else {
                          throw err;
                        }
                      });
            },
            timeout, 'waiting for page to load for ' + timeout + 'ms')
        .then(null, deferred.reject);

    this.driver.controlFlow().execute(() => {
      return this.plugins_.onPageLoad();
    });

    // Make sure the page is an Angular page.
    this.executeAsyncScript_(
            clientSideScripts.testForAngular, msg('test for angular'), Math.floor(timeout / 1000),
            this.ng12Hybrid)
        .then(
            (angularTestResult: {ver: number, message: string}) => {
              let angularVersion = angularTestResult.ver;
              if (!angularVersion) {
                let message = angularTestResult.message;
                logger.error(`Could not find Angular on page ${destination} : ${message}`);
                throw new Error(
                    `Angular could not be found on the page ${destination}. If this is not an ` +
                    `Angular application, you may need to turn off waiting for Angular. Please ` +
                    `see https://github.com/angular/protractor/blob/master/docs/timeouts.md#waiting-for-angular-on-page-load`);
              }
              return angularVersion;
            },
            (err: Error) => {
              throw new Error('Error while running testForAngular: ' + err.message);
            })
        .then(loadMocks, deferred.reject);

    let self = this;
    function loadMocks(angularVersion: number) {
      if (angularVersion === 1) {
        // At this point, Angular will pause for us until angular.resumeBootstrap is called.
        let moduleNames: string[] = [];
        for (const {name, script, args} of self.mockModules_) {
          moduleNames.push(name);
          let executeScriptArgs = [script, msg('add mock module ' + name), ...args];
          self.executeScriptWithDescription.apply(self, executeScriptArgs)
              .then(
                  null,
                  (err: Error) => {
                    throw new Error(
                        'Error while running module script ' + name + ': ' + err.message);
                  })
              .then(null, deferred.reject);
        }

        self.executeScriptWithDescription(
                'angular.resumeBootstrap(arguments[0]);', msg('resume bootstrap'), moduleNames)
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

    if (this.bpClient) {
      this.driver.controlFlow().execute(() => {
        return this.bpClient.setSynchronization(!this.internalIgnoreSynchronization);
      });
    }

    this.driver.controlFlow().execute(() => {
      return this.plugins_.onPageStable().then(() => {
        deferred.fulfill();
      }, deferred.reject);
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
        .executeScriptWithDescription(
            'return window.location.href', 'Protractor.refresh() - getUrl')
        .then((href: string) => {
          return this.get(href, opt_timeout);
        });
  }

  /**
   * Mixin navigation methods back into the navigation object so that
   * they are invoked as before, i.e. driver.navigate().refresh()
   */
  navigate(): any {
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
  setLocation(url: string): wdpromise.Promise<any> {
    this.waitForAngular();
    return this
        .executeScriptWithDescription(
            clientSideScripts.setLocation, 'Protractor.setLocation()', this.rootEl, url)
        .then((browserErr: Error) => {
          if (browserErr) {
            throw 'Error while navigating to \'' + url + '\' : ' + JSON.stringify(browserErr);
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
  getLocationAbsUrl(): wdpromise.Promise<any> {
    this.waitForAngular();
    return this.executeScriptWithDescription(
        clientSideScripts.getLocationAbsUrl, 'Protractor.getLocationAbsUrl()', this.rootEl);
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
    wdpromise.controlFlow().execute(() => {
      debugger;
    }, 'add breakpoint to control flow');
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
      logger.info('Use the `list` helper function to find elements by strategy:');
      logger.info('  e.g., list(by.binding(\'\')) gets all bindings.');
      logger.info();
    };
    this.debugHelper.init(debuggerClientPath, onStartFn, opt_debugPort);
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
  pause(opt_debugPort?: number): wdpromise.Promise<any> {
    if (this.debugHelper.isAttached()) {
      logger.info('Encountered browser.pause(), but debugger already attached.');
      return wdpromise.fulfilled(true);
    }
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
    this.debugHelper.init(debuggerClientPath, onStartFn, opt_debugPort);
  }
}
