import { ActionSequence, Capabilities, Command as WdCommand, FileDetector, Options, promise as wdpromise, Session, TargetLocator, TouchSequence, until, WebDriver, WebElement } from 'selenium-webdriver';
import { ElementArrayFinder, ElementFinder } from './element';
import { ProtractorExpectedConditions } from './expectedConditions';
import { Locator, ProtractorBy } from './locators';
import { Plugins } from './plugins';
export declare class Webdriver {
    actions: () => ActionSequence;
    call: (fn: (...var_args: any[]) => any, opt_scope?: any, ...var_args: any[]) => wdpromise.Promise<any>;
    close: () => void;
    controlFlow: () => wdpromise.ControlFlow;
    executeScript: (script: string | Function, ...var_args: any[]) => wdpromise.Promise<any>;
    executeAsyncScript: (script: string | Function, ...var_args: any[]) => wdpromise.Promise<any>;
    getCapabilities: () => Capabilities;
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
    wait: (condition: wdpromise.Promise<any> | until.Condition<any> | Function, opt_timeout?: number, opt_message?: string) => wdpromise.Promise<any>;
}
export interface ElementHelper extends Function {
    (locator: Locator): ElementFinder;
    all?: (locator: Locator) => ElementArrayFinder;
}
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
export declare class ProtractorBrowser extends Webdriver {
    /**
     * @type {ProtractorBy}
     */
    static By: ProtractorBy;
    /**
     * @type {ExpectedConditions}
     */
    static ExpectedConditions: ProtractorExpectedConditions;
    /**
     * The wrapped webdriver instance. Use this to interact with pages that do
     * not contain Angular (such as a log-in screen).
     *
     * @type {webdriver.WebDriver}
     */
    driver: WebDriver;
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
    ready: wdpromise.Promise<any>;
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
    allScriptsTimeout: number;
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
    /**
     * Set to true when we validate that the debug port is open. Since the debug
     * port is held open forever once the debugger is attached, it's important
     * we only do validation once.
     */
    debuggerValidated_: boolean;
    /**
     * If true, Protractor will interpret any angular apps it comes across as
     * hybrid angular1/angular2 apps.
     *
     * @type {boolean}
     */
    ng12Hybrid: boolean;
    [key: string]: any;
    constructor(webdriverInstance: WebDriver, opt_baseUrl?: string, opt_rootElement?: string, opt_untrackOutstandingTimeouts?: boolean);
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
    getProcessedConfig(): wdpromise.Promise<any>;
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
    forkNewDriverInstance(opt_useSameUrl?: boolean, opt_copyMockModules?: boolean): ProtractorBrowser;
    /**
     * Restart the browser instance.
     *
     * Set by the runner.
     */
    restart(): void;
    /**
     * Instead of using a single root element, search through all angular apps
     * available on the page when finding elements or waiting for stability.
     * Only compatible with Angular2.
     */
    useAllAngular2AppRoots(): void;
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
    private executeScript_(script, description, ...scriptArgs);
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
    private executeAsyncScript_(script, description, ...scriptArgs);
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
    waitForAngular(opt_description?: string): wdpromise.Promise<any>;
    /**
     * Waits for Angular to finish rendering before searching for elements.
     * @see webdriver.WebDriver.findElement
     * @returns {!webdriver.promise.Promise} A promise that will be resolved to
     *      the located {@link webdriver.WebElement}.
     */
    findElement(locator: Locator): WebElement;
    /**
     * Waits for Angular to finish rendering before searching for elements.
     * @see webdriver.WebDriver.findElements
     * @returns {!webdriver.promise.Promise} A promise that will be resolved to an
     *     array of the located {@link webdriver.WebElement}s.
     */
    findElements(locator: Locator): webdriver.promise.Promise<any>;
    /**
     * Tests if an element is present on the page.
     * @see webdriver.WebDriver.isElementPresent
     * @returns {!webdriver.promise.Promise} A promise that will resolve to whether
     *     the element is present on the page.
     */
    isElementPresent(locatorOrElement: ProtractorBy | webdriver.WebElement): webdriver.promise.Promise<any>;
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
    addMockModule(name: string, script: string | Function, ...moduleArgs: any[]): void;
    /**
     * Clear the list of registered mock modules.
     */
    clearMockModules(): void;
    /**
     * Remove a registered mock module.
     *
     * @example
     * browser.removeMockModule('modName');
     *
     * @param {!string} name The name of the module to remove.
     */
    removeMockModule(name: string): void;
    /**
     * Get a list of the current mock modules.
     *
     * @returns {Array.<!string|Function>} The list of mock modules.
     */
    getRegisteredMockModules(): Array<string | Function>;
    /**
     * Add the base mock modules used for all Protractor tests.
     *
     * @private
     */
    private addBaseMockModules_();
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
    get(destination: string, opt_timeout?: number): any;
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
    refresh(opt_timeout?: number): wdpromise.Promise<void>;
    /**
     * Mixin navigation methods back into the navigation object so that
     * they are invoked as before, i.e. driver.navigate().refresh()
     */
    navigate(): any;
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
    setLocation(url: string): webdriver.promise.Promise<any>;
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
    getLocationAbsUrl(): webdriver.promise.Promise<any>;
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
    debugger(): void;
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
    private validatePortAvailability_(port);
    private dbgCodeExecutor_;
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
    private initDebugger_(debuggerClientPath, onStartFn, opt_debugPort?);
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
    enterRepl(opt_debugPort?: number): void;
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
    pause(opt_debugPort?: number): webdriver.promise.Promise<any>;
    /**
     * Create a new instance of Browser by wrapping a webdriver instance.
     *
     * @param {webdriver.WebDriver} webdriver The configured webdriver instance.
     * @param {string=} opt_baseUrl A URL to prepend to relative gets.
     * @param {boolean=} opt_untrackOutstandingTimeouts Whether Browser should
     *     stop tracking outstanding $timeouts.
     * @returns {Browser} a new Browser instance
     */
    static wrapDriver(webdriver: webdriver.WebDriver, baseUrl?: string, rootElement?: string, untrackOutstandingTimeouts?: boolean): ProtractorBrowser;
}
