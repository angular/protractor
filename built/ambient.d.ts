declare namespace protractor {
export  class Webdriver {
    actions: () => any;
    wait: (condition: any | any | Function, opt_timeout?: number, opt_message?: string) => any;
    sleep: (ms: number) => any;
    getCurrentUrl: () => any;
    getTitle: () => any;
    takeScreenshot: () => any;
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
export  class Browser extends Webdriver {
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
    driver: any;
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
    ready: any;
    plugins_: any;
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
    debuggerValidated_: boolean;
    [key: string]: any;
    constructor(webdriverInstance: any, opt_baseUrl?: string, opt_rootElement?: string, opt_untrackOutstandingTimeouts?: boolean);
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
    getProcessedConfig(): any;
    /**
     * Fork another instance of protractor for use in interactive tests.
     *
     * Set by the runner.
     *
     * @param {boolean} opt_useSameUrl Whether to navigate to current url on
     * creation
     * @param {boolean} opt_copyMockModules Whether to apply same mock modules on
     * creation
     * @returns {Protractor} a protractor instance.
     */
    forkNewDriverInstance(opt_useSameUrl?: boolean, opt_copyMockModules?: boolean): Browser;
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
    waitForAngular(opt_description?: string): any;
    /**
     * Waits for Angular to finish rendering before searching for elements.
     * @see webdriver.WebDriver.findElement
     * @returns {!webdriver.promise.Promise} A promise that will be resolved to
     *      the located {@link webdriver.WebElement}.
     */
    findElement(locator: Locator): any;
    /**
     * Waits for Angular to finish rendering before searching for elements.
     * @see webdriver.WebDriver.findElements
     * @returns {!webdriver.promise.Promise} A promise that will be resolved to an
     *     array of the located {@link webdriver.WebElement}s.
     */
    findElements(locator: Locator): any;
    /**
     * Tests if an element is present on the page.
     * @see webdriver.WebDriver.isElementPresent
     * @returns {!webdriver.promise.Promise} A promise that will resolve to whether
     *     the element is present on the page.
     */
    isElementPresent(locatorOrElement: any | any): any;
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
    refresh(opt_timeout?: number): any;
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
    setLocation(url: string): any;
    /**
     * Returns the current absolute url from AngularJS.
     *
     * @example
     * browser.get('http://angular.github.io/protractor/#/api');
     * expect(browser.getLocationAbsUrl())
     *     .toBe('http://angular.github.io/protractor/#/api');
     * @returns {string} The current absolute url from AngularJS.
     */
    getLocationAbsUrl(): any;
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
     *   Press Ctrl + C to leave rdebug repl
     *   > ptor.findElement(protractor.By.input('user').sendKeys('Laura'));
     *   > ptor.debugger();
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
    pause(opt_debugPort?: number): void;
    /**
     * Create a new instance of Browser by wrapping a webdriver instance.
     *
     * @param {webdriver.WebDriver} webdriver The configured webdriver instance.
     * @param {string=} opt_baseUrl A URL to prepend to relative gets.
     * @param {boolean=} opt_untrackOutstandingTimeouts Whether Browser should
     *     stop tracking outstanding $timeouts.
     * @returns {Browser} a new Browser instance
     */
    static wrapDriver(webdriver: any, baseUrl?: string, rootElement?: string, untrackOutstandingTimeouts?: boolean): Browser;
}

export  class WebdriverWebElement {
    getDriver: () => any;
    getId: () => any;
    getRawId: () => any;
    serialize: () => any;
    findElement: (subLocator: Locator) => any;
    click: () => any;
    sendKeys: (...args: (string | any)[]) => any;
    getTagName: () => any;
    getCssValue: (cssStyleProperty: string) => any;
    getAttribute: (attributeName: string) => any;
    getText: () => any;
    getSize: () => any;
    getLocation: () => any;
    isEnabled: () => any;
    isSelected: () => any;
    submit: () => any;
    clear: () => any;
    isDisplayed: () => any;
    takeScreenshot: (opt_scroll?: boolean) => any;
    getOuterHtml: () => any;
    getInnerHtml: () => any;
}
/**
 * ElementArrayFinder is used for operations on an array of elements (as opposed
 * to a single element).
 *
 * The ElementArrayFinder is used to set up a chain of conditions that identify
 * an array of elements. In particular, you can call all(locator) and
 * filter(filterFn) to return a new ElementArrayFinder modified by the
 * conditions, and you can call get(index) to return a single ElementFinder at
 * position 'index'.
 *
 * Similar to jquery, ElementArrayFinder will search all branches of the DOM
 * to find the elements that satisfy the conditions (i.e. all, filter, get).
 * However, an ElementArrayFinder will not actually retrieve the elements until
 * an action is called, which means it can be set up in helper files (i.e.
 * page objects) before the page is available, and reused as the page changes.
 *
 * You can treat an ElementArrayFinder as an array of WebElements for most
 * purposes, in particular, you may perform actions (i.e. click, getText) on
 * them as you would an array of WebElements. The action will apply to
 * every element identified by the ElementArrayFinder. ElementArrayFinder
 * extends Promise, and once an action is performed on an ElementArrayFinder,
 * the latest result can be accessed using then, and will be returned as an
 * array of the results; the array has length equal to the length of the
 * elements found by the ElementArrayFinder and each result represents the
 * result of performing the action on the element. Unlike a WebElement, an
 * ElementArrayFinder will wait for the angular app to settle before
 * performing finds or actions.
 *
 * @alias element.all(locator)
 * @view
 * <ul class="items">
 *   <li>First</li>
 *   <li>Second</li>
 *   <li>Third</li>
 * </ul>
 *
 * @example
 * element.all(by.css('.items li')).then(function(items) {
 *   expect(items.length).toBe(3);
 *   expect(items[0].getText()).toBe('First');
 * });
 *
 * @constructor
 * @param {Browser} browser A protractor instance.
 * @param {function(): Array.<webdriver.WebElement>} getWebElements A function
 *    that returns a list of the underlying Web Elements.
 * @param {webdriver.Locator} locator The most relevant locator. It is only
 *    used for error reporting and ElementArrayFinder.locator.
 * @param {Array.<webdriver.promise.Promise>} opt_actionResults An array
 *    of promises which will be retrieved with then. Resolves to the latest
 *    action result, or null if no action has been called.
 * @returns {ElementArrayFinder}
 */
export  class ElementArrayFinder extends WebdriverWebElement {
    private browser_;
    private locator_;
    actionResults_: any;
    getWebElements: Function;
    constructor(browser_: Browser, getWebElements?: Function, locator_?: any, actionResults_?: any);
    /**
     * Create a shallow copy of ElementArrayFinder.
     *
     * @returns {!ElementArrayFinder} A shallow copy of this.
     */
    clone(): ElementArrayFinder;
    /**
     * Calls to ElementArrayFinder may be chained to find an array of elements
     * using the current elements in this ElementArrayFinder as the starting
     * point.
     * This function returns a new ElementArrayFinder which would contain the
     * children elements found (and could also be empty).
     *
     * @alias element.all(locator).all(locator)
     * @view
     * <div id='id1' class="parent">
     *   <ul>
     *     <li class="foo">1a</li>
     *     <li class="baz">1b</li>
     *   </ul>
     * </div>
     * <div id='id2' class="parent">
     *   <ul>
     *     <li class="foo">2a</li>
     *     <li class="bar">2b</li>
     *   </ul>
     * </div>
     *
     * @example
     * let foo = element.all(by.css('.parent')).all(by.css('.foo'))
     * expect(foo.getText()).toEqual(['1a', '2a'])
     * let baz = element.all(by.css('.parent')).all(by.css('.baz'))
     * expect(baz.getText()).toEqual(['1b'])
     * let nonexistent =
     * element.all(by.css('.parent')).all(by.css('.NONEXISTENT'))
     * expect(nonexistent.getText()).toEqual([''])
     *
     * @param {webdriver.Locator} subLocator
     * @returns {ElementArrayFinder}
     */
    all(locator: Locator): ElementArrayFinder;
    /**
     * Apply a filter function to each element within the ElementArrayFinder.
     * Returns
     * a new ElementArrayFinder with all elements that pass the filter function.
     * The
     * filter function receives the ElementFinder as the first argument
     * and the index as a second arg.
     * This does not actually retrieve the underlying list of elements, so it can
     * be used in page objects.
     *
     * @alias element.all(locator).filter(filterFn)
     * @view
     * <ul class="items">
     *   <li class="one">First</li>
     *   <li class="two">Second</li>
     *   <li class="three">Third</li>
     * </ul>
     *
     * @example
     * element.all(by.css('.items li')).filter(function(elem, index) {
     *   return elem.getText().then(function(text) {
     *     return text === 'Third';
     *   });
     * }).first().click();
     *
     * @param {function(ElementFinder, number): webdriver.WebElement.Promise}
     * filterFn
     *     Filter function that will test if an element should be returned.
     *     filterFn can either return a boolean or a promise that resolves to a
     * boolean
     * @returns {!ElementArrayFinder} A ElementArrayFinder that represents an
     * array
     *     of element that satisfy the filter function.
     */
    filter(filterFn: Function): ElementArrayFinder;
    /**
     * Get an element within the ElementArrayFinder by index. The index starts at
     * 0.
     * Negative indices are wrapped (i.e. -i means ith element from last)
     * This does not actually retrieve the underlying element.
     *
     * @alias element.all(locator).get(index)
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * let list = element.all(by.css('.items li'));
     * expect(list.get(0).getText()).toBe('First');
     * expect(list.get(1).getText()).toBe('Second');
     *
     * @param {number|webdriver.promise.Promise} index Element index.
     * @returns {ElementFinder} finder representing element at the given index.
     */
    get(index: number): ElementFinder;
    /**
     * Get the first matching element for the ElementArrayFinder. This does not
     * actually retrieve the underlying element.
     *
     * @alias element.all(locator).first()
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * let first = element.all(by.css('.items li')).first();
     * expect(first.getText()).toBe('First');
     *
     * @returns {ElementFinder} finder representing the first matching element
     */
    first(): ElementFinder;
    /**
     * Get the last matching element for the ElementArrayFinder. This does not
     * actually retrieve the underlying element.
     *
     * @alias element.all(locator).last()
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * let last = element.all(by.css('.items li')).last();
     * expect(last.getText()).toBe('Third');
     *
     * @returns {ElementFinder} finder representing the last matching element
     */
    last(): ElementFinder;
    /**
     * Shorthand function for finding arrays of elements by css.
     *
     * @type {function(string): ElementArrayFinder}
     */
    $$(selector: string): ElementArrayFinder;
    /**
     * Returns an ElementFinder representation of ElementArrayFinder. It ensures
     * that the ElementArrayFinder resolves to one and only one underlying
     * element.
     *
     * @returns {ElementFinder} An ElementFinder representation
     * @private
     */
    toElementFinder_(): ElementFinder;
    /**
     * Count the number of elements represented by the ElementArrayFinder.
     *
     * @alias element.all(locator).count()
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * let list = element.all(by.css('.items li'));
     * expect(list.count()).toBe(3);
     *
     * @returns {!webdriver.promise.Promise} A promise which resolves to the
     *     number of elements matching the locator.
     */
    count(): any;
    /**
     * Returns the most relevant locator.
     *
     * @example
     * // returns by.css('#ID1')
     * $('#ID1').locator()
     *
     * // returns by.css('#ID2')
     * $('#ID1').$('#ID2').locator()
     *
     * // returns by.css('#ID1')
     * $$('#ID1').filter(filterFn).get(0).click().locator()
     *
     * @returns {webdriver.Locator}
     */
    locator(): Locator;
    /**
     * Apply an action function to every element in the ElementArrayFinder,
     * and return a new ElementArrayFinder that contains the results of the
     * actions.
     *
     * @param {function(ElementFinder)} actionFn
     *
     * @returns {ElementArrayFinder}
     * @private
     */
    applyAction_(actionFn: Function): ElementArrayFinder;
    /**
     * Represents the ElementArrayFinder as an array of ElementFinders.
     *
     * @returns {Array.<ElementFinder>} Return a promise, which resolves to a list
     *     of ElementFinders specified by the locator.
     */
    asElementFinders_(): any;
    /**
     * Retrieve the elements represented by the ElementArrayFinder. The input
     * function is passed to the resulting promise, which resolves to an
     * array of ElementFinders.
     *
     * @alias element.all(locator).then(thenFunction)
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * element.all(by.css('.items li')).then(function(arr) {
     *   expect(arr.length).toEqual(3);
     * });
     *
     * @param {function(Array.<ElementFinder>)} fn
     * @param {function(Error)} errorFn
     *
     * @returns {!webdriver.promise.Promise} A promise which will resolve to
     *     an array of ElementFinders represented by the ElementArrayFinder.
     */
    then(fn: Function, errorFn: Function): any;
    /**
     * Calls the input function on each ElementFinder represented by the
     * ElementArrayFinder.
     *
     * @alias element.all(locator).each(eachFunction)
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * element.all(by.css('.items li')).each(function(element, index) {
     *   // Will print 0 First, 1 Second, 2 Third.
     *   element.getText().then(function (text) {
     *     console.log(index, text);
     *   });
     * });
     *
     * @param {function(ElementFinder)} fn Input function
     *
     * @returns {!webdriver.promise.Promise} A promise that will resolve when the
     *     function has been called on all the ElementFinders. The promise will
     *     resolve to null.
     */
    each(fn: Function): any;
    /**
     * Apply a map function to each element within the ElementArrayFinder. The
     * callback receives the ElementFinder as the first argument and the index as
     * a second arg.
     *
     * @alias element.all(locator).map(mapFunction)
     * @view
     * <ul class="items">
     *   <li class="one">First</li>
     *   <li class="two">Second</li>
     *   <li class="three">Third</li>
     * </ul>
     *
     * @example
     * let items = element.all(by.css('.items li')).map(function(elm, index) {
     *   return {
     *     index: index,
     *     text: elm.getText(),
     *     class: elm.getAttribute('class')
     *   };
     * });
     * expect(items).toEqual([
     *   {index: 0, text: 'First', class: 'one'},
     *   {index: 1, text: 'Second', class: 'two'},
     *   {index: 2, text: 'Third', class: 'three'}
     * ]);
     *
     * @param {function(ElementFinder, number)} mapFn Map function that
     *     will be applied to each element.
     * @returns {!webdriver.promise.Promise} A promise that resolves to an array
     *     of values returned by the map function.
     */
    map(mapFn: Function): any;
    /**
     * Apply a reduce function against an accumulator and every element found
     * using the locator (from left-to-right). The reduce function has to reduce
     * every element into a single value (the accumulator). Returns promise of
     * the accumulator. The reduce function receives the accumulator, current
     * ElementFinder, the index, and the entire array of ElementFinders,
     * respectively.
     *
     * @alias element.all(locator).reduce(reduceFn)
     * @view
     * <ul class="items">
     *   <li class="one">First</li>
     *   <li class="two">Second</li>
     *   <li class="three">Third</li>
     * </ul>
     *
     * @example
     * let value = element.all(by.css('.items li')).reduce(function(acc, elem) {
     *   return elem.getText().then(function(text) {
     *     return acc + text + ' ';
     *   });
     * }, '');
     *
     * expect(value).toEqual('First Second Third ');
     *
     * @param {function(number, ElementFinder, number, Array.<ElementFinder>)}
     *     reduceFn Reduce function that reduces every element into a single
     * value.
     * @param {*} initialValue Initial value of the accumulator.
     * @returns {!webdriver.promise.Promise} A promise that resolves to the final
     *     value of the accumulator.
     */
    reduce(reduceFn: Function, initialValue: any): any;
    /**
     * Evaluates the input as if it were on the scope of the current underlying
     * elements.
     *
     * @view
     * <span class="foo">{{letiableInScope}}</span>
     *
     * @example
     * let value = element.all(by.css('.foo')).evaluate('letiableInScope');
     *
     * @param {string} expression
     *
     * @returns {ElementArrayFinder} which resolves to the
     *     evaluated expression for each underlying element.
     *     The result will be resolved as in
     *     {@link webdriver.WebDriver.executeScript}. In summary - primitives will
     *     be resolved as is, functions will be converted to string, and elements
     *     will be returned as a WebElement.
     */
    evaluate(expression: string): ElementArrayFinder;
    /**
     * Determine if animation is allowed on the current underlying elements.
     * @param {string} value
     *
     * @example
     * // Turns off ng-animate animations for all elements in the <body>
     * element(by.css('body')).allowAnimations(false);
     *
     * @returns {ElementArrayFinder} which resolves to whether animation is
     * allowed.
     */
    allowAnimations(value: boolean): ElementArrayFinder;
}
/**
 * The ElementFinder simply represents a single element of an
 * ElementArrayFinder (and is more like a convenience object). As a result,
 * anything that can be done with an ElementFinder, can also be done using
 * an ElementArrayFinder.
 *
 * The ElementFinder can be treated as a WebElement for most purposes, in
 * particular, you may perform actions (i.e. click, getText) on them as you
 * would a WebElement. Once an action is performed on an ElementFinder, the
 * latest result from the chain can be accessed using the then method.
 * Unlike a WebElement, an ElementFinder will wait for angular to settle before
 * performing finds or actions.
 *
 * ElementFinder can be used to build a chain of locators that is used to find
 * an element. An ElementFinder does not actually attempt to find the element
 * until an action is called, which means they can be set up in helper files
 * before the page is available.
 *
 * @alias element(locator)
 * @view
 * <span>{{person.name}}</span>
 * <span ng-bind="person.email"></span>
 * <input type="text" ng-model="person.name"/>
 *
 * @example
 * // Find element with {{scopelet}} syntax.
 * element(by.binding('person.name')).getText().then(function(name) {
 *   expect(name).toBe('Foo');
 * });
 *
 * // Find element with ng-bind="scopelet" syntax.
 * expect(element(by.binding('person.email')).getText()).toBe('foo@bar.com');
 *
 * // Find by model.
 * let input = element(by.model('person.name'));
 * input.sendKeys('123');
 * expect(input.getAttribute('value')).toBe('Foo123');
 *
 * @constructor
 * @extends {webdriver.WebElement}
 * @param {Browser} browser_
 * @param {ElementArrayFinder} elementArrayFinder The ElementArrayFinder
 *     that this is branched from.
 * @returns {ElementFinder}
 */
export  class ElementFinder extends WebdriverWebElement {
    private browser_;
    parentElementArrayFinder: ElementArrayFinder;
    elementArrayFinder_: ElementArrayFinder;
    then: (fn: Function, errorFn: Function) => any;
    constructor(browser_: Browser, elementArrayFinder: ElementArrayFinder);
    static fromWebElement_(browser: Browser, webElem: any, locator: Locator): ElementFinder;
    /**
     * Create a shallow copy of ElementFinder.
     *
     * @returns {!ElementFinder} A shallow copy of this.
     */
    clone(): ElementFinder;
    /**
     * @see ElementArrayFinder.prototype.locator
     *
     * @returns {webdriver.Locator}
     */
    locator(): any;
    /**
     * Returns the WebElement represented by this ElementFinder.
     * Throws the WebDriver error if the element doesn't exist.
     *
     * @alias element(locator).getWebElement()
     * @view
     * <div class="parent">
     *   some text
     * </div>
     *
     * @example
     * // The following three expressions are equivalent.
     * element(by.css('.parent')).getWebElement();
     * browser.driver.findElement(by.css('.parent'));
     * browser.findElement(by.css('.parent'));
     *
     * @returns {webdriver.WebElement}
     */
    getWebElement(): any;
    /**
     * Calls to {@code all} may be chained to find an array of elements within a
     * parent.
     *
     * @alias element(locator).all(locator)
     * @view
     * <div class="parent">
     *   <ul>
     *     <li class="one">First</li>
     *     <li class="two">Second</li>
     *     <li class="three">Third</li>
     *   </ul>
     * </div>
     *
     * @example
     * let items = element(by.css('.parent')).all(by.tagName('li'))
     *
     * @param {webdriver.Locator} subLocator
     * @returns {ElementArrayFinder}
     */
    all(subLocator: Locator): ElementArrayFinder;
    /**
     * Calls to {@code element} may be chained to find elements within a parent.
     *
     * @alias element(locator).element(locator)
     * @view
     * <div class="parent">
     *   <div class="child">
     *     Child text
     *     <div>{{person.phone}}</div>
     *   </div>
     * </div>
     *
     * @example
     * // Chain 2 element calls.
     * let child = element(by.css('.parent')).
     *     element(by.css('.child'));
     * expect(child.getText()).toBe('Child text\n555-123-4567');
     *
     * // Chain 3 element calls.
     * let triple = element(by.css('.parent')).
     *     element(by.css('.child')).
     *     element(by.binding('person.phone'));
     * expect(triple.getText()).toBe('555-123-4567');
     *
     * @param {webdriver.Locator} subLocator
     * @returns {ElementFinder}
     */
    element(subLocator: Locator): ElementFinder;
    /**
     * Calls to {@code $$} may be chained to find an array of elements within a
     * parent.
     *
     * @alias element(locator).all(selector)
     * @view
     * <div class="parent">
     *   <ul>
     *     <li class="one">First</li>
     *     <li class="two">Second</li>
     *     <li class="three">Third</li>
     *   </ul>
     * </div>
     *
     * @example
     * let items = element(by.css('.parent')).$$('li')
     *
     * @param {string} selector a css selector
     * @returns {ElementArrayFinder}
     */
    $$(selector: string): ElementArrayFinder;
    /**
     * Calls to {@code $} may be chained to find elements within a parent.
     *
     * @alias element(locator).$(selector)
     * @view
     * <div class="parent">
     *   <div class="child">
     *     Child text
     *     <div>{{person.phone}}</div>
     *   </div>
     * </div>
     *
     * @example
     * // Chain 2 element calls.
     * let child = element(by.css('.parent')).
     *     $('.child');
     * expect(child.getText()).toBe('Child text\n555-123-4567');
     *
     * // Chain 3 element calls.
     * let triple = element(by.css('.parent')).
     *     $('.child').
     *     element(by.binding('person.phone'));
     * expect(triple.getText()).toBe('555-123-4567');
     *
     * @param {string} selector A css selector
     * @returns {ElementFinder}
     */
    $(selector: string): ElementFinder;
    /**
     * Determine whether the element is present on the page.
     *
     * @view
     * <span>{{person.name}}</span>
     *
     * @example
     * // Element exists.
     * expect(element(by.binding('person.name')).isPresent()).toBe(true);
     *
     * // Element not present.
     * expect(element(by.binding('notPresent')).isPresent()).toBe(false);
     *
     * @returns {ElementFinder} which resolves to whether
     *     the element is present on the page.
     */
    isPresent(): ElementFinder;
    /**
     * Same as ElementFinder.isPresent(), except this checks whether the element
     * identified by the subLocator is present, rather than the current element
     * finder. i.e. `element(by.css('#abc')).element(by.css('#def')).isPresent()` is
     * identical to `element(by.css('#abc')).isElementPresent(by.css('#def'))`.
     *
     * @see ElementFinder.isPresent
     *
     * @param {webdriver.Locator} subLocator Locator for element to look for.
     * @returns {ElementFinder} which resolves to whether
     *     the subelement is present on the page.
     */
    isElementPresent(subLocator: any): ElementFinder;
    /**
     * Evaluates the input as if it were on the scope of the current element.
     * @see ElementArrayFinder.prototype.evaluate
     *
     * @view
     * <span id="foo">{{letiableInScope}}</span>
     *
     * @example
     * let value = element(by.id('foo')).evaluate('letiableInScope');
     *
     * @param {string} expression
     *
     * @returns {ElementFinder} which resolves to the evaluated expression.
     */
    evaluate(expression: string): ElementFinder;
    /**
     * @see ElementArrayFinder.prototype.allowAnimations.
     * @param {string} value
     *
     * @returns {ElementFinder} which resolves to whether animation is allowed.
     */
    allowAnimations(value: boolean): ElementFinder;
    /**
     * Compares an element to this one for equality.
     *
     * @param {!ElementFinder|!webdriver.WebElement} The element to compare to.
     *
     * @returns {!webdriver.promise.Promise.<boolean>} A promise that will be
     *     resolved to whether the two WebElements are equal.
     */
    equals(element: any): any;
}
/**
 * Shortcut for querying the document directly with css.
 * `element(by.css('.abc'))` is equivalent to `$('.abc')`
 *
 *
 * @alias $(cssSelector)
 * @view
 * <div class="count">
 *   <span class="one">First</span>
 *   <span class="two">Second</span>
 * </div>
 *
 * @example
 * let item = $('.count .two');
 * expect(item.getText()).toBe('Second');
 *
 * @param {string} selector A css selector
 * @returns {ElementFinder} which identifies the located
 *     {@link webdriver.WebElement}
 */
export  let build$: (element: any, by: any) => (selector: string) => any;
/**
 * Shortcut for querying the document directly with css.
 * `element.all(by.css('.abc'))` is equivalent to `$$('.abc')`
 *
 * @alias $$(cssSelector)
 * @view
 * <div class="count">
 *   <span class="one">First</span>
 *   <span class="two">Second</span>
 * </div>
 *
 * @example
 * // The following protractor expressions are equivalent.
 * let list = element.all(by.css('.count span'));
 * expect(list.count()).toBe(2);
 *
 * list = $$('.count span');
 * expect(list.count()).toBe(2);
 * expect(list.get(0).getText()).toBe('First');
 * expect(list.get(1).getText()).toBe('Second');
 *
 * @param {string} selector a css selector
 * @returns {ElementArrayFinder} which identifies the
 *     array of the located {@link webdriver.WebElement}s.
 */
export  let build$$: (element: any, by: any) => (selector: string) => any;

export  class WebdriverBy {
    className: (className: string) => Locator;
    css: (css: string) => Locator;
    id: (id: string) => Locator;
    linkText: (linkText: string) => Locator;
    js: (js: string) => Locator;
    name: (name: string) => Locator;
    partialLinkText: (partialText: string) => Locator;
    tagName: (tagName: string) => Locator;
    xpath: (xpath: string) => Locator;
}
export interface Locator {
    findElementsOverride?: (driver: any, using: any, rootSelector: string) => any;
    row?: (index: number) => Locator;
    column?: (index: string) => Locator;
}
/**
 * The Protractor Locators. These provide ways of finding elements in
 * Angular applications by binding, model, etc.
 *
 * @alias by
 * @extends {webdriver.By}
 */
export  class ProtractorBy extends WebdriverBy {
    [key: string]: any;
    /**
     * Add a locator to this instance of ProtractorBy. This locator can then be
     * used with element(by.locatorName(args)).
     *
     * @view
     * <button ng-click="doAddition()">Go!</button>
     *
     * @example
     * // Add the custom locator.
     * by.addLocator('buttonTextSimple',
     *     function(buttonText, opt_parentElement, opt_rootSelector) {
     *   // This function will be serialized as a string and will execute in the
     *   // browser. The first argument is the text for the button. The second
     *   // argument is the parent element, if any.
     *   var using = opt_parentElement || document,
     *       buttons = using.querySelectorAll('button');
     *
     *   // Return an array of buttons with the text.
     *   return Array.prototype.filter.call(buttons, function(button) {
     *     return button.textContent === buttonText;
     *   });
     * });
     *
     * // Use the custom locator.
     * element(by.buttonTextSimple('Go!')).click();
     *
     * @alias by.addLocator(locatorName, functionOrScript)
     * @param {string} name The name of the new locator.
     * @param {Function|string} script A script to be run in the context of
     *     the browser. This script will be passed an array of arguments
     *     that contains any args passed into the locator followed by the
     *     element scoping the search and the css selector for the root angular
     *     element. It should return an array of elements.
     */
    addLocator(name: string, script: Function | string): void;
    /**
     * Find an element by text binding. Does a partial match, so any elements
     * bound
     * to variables containing the input string will be returned.
     *
     * Note: For AngularJS version 1.2, the interpolation brackets, (usually
     * {{}}),
     * are optionally allowed in the binding description string. For Angular
     * version
     * 1.3+, they are not allowed, and no elements will be found if they are used.
     *
     * @view
     * <span>{{person.name}}</span>
     * <span ng-bind="person.email"></span>
     *
     * @example
     * var span1 = element(by.binding('person.name'));
     * expect(span1.getText()).toBe('Foo');
     *
     * var span2 = element(by.binding('person.email'));
     * expect(span2.getText()).toBe('foo@bar.com');
     *
     * // You can also use a substring for a partial match
     * var span1alt = element(by.binding('name'));
     * expect(span1alt.getText()).toBe('Foo');
     *
     * // This works for sites using Angular 1.2 but NOT 1.3
     * var deprecatedSyntax = element(by.binding('{{person.name}}'));
     *
     * @param {string} bindingDescriptor
     * @returns {Locator} location strategy
     */
    binding(bindingDescriptor: string): Locator;
    /**
     * Find an element by exact binding.
     *
     * @view
     * <span>{{ person.name }}</span>
     * <span ng-bind="person-email"></span>
     * <span>{{person_phone|uppercase}}</span>
     *
     * @example
     * expect(element(by.exactBinding('person.name')).isPresent()).toBe(true);
     * expect(element(by.exactBinding('person-email')).isPresent()).toBe(true);
     * expect(element(by.exactBinding('person')).isPresent()).toBe(false);
     * expect(element(by.exactBinding('person_phone')).isPresent()).toBe(true);
     * expect(element(by.exactBinding('person_phone|uppercase')).isPresent()).toBe(true);
     * expect(element(by.exactBinding('phone')).isPresent()).toBe(false);
     *
     * @param {string} bindingDescriptor
     * @returns {Locator} location strategy
     */
    exactBinding(bindingDescriptor: string): Locator;
    /**
     * Find an element by ng-model expression.
     *
     * @alias by.model(modelName)
     * @view
     * <input type="text" ng-model="person.name">
     *
     * @example
     * var input = element(by.model('person.name'));
     * input.sendKeys('123');
     * expect(input.getAttribute('value')).toBe('Foo123');
     *
     * @param {string} model ng-model expression.
     * @returns {Locator} location strategy
     */
    model(model: string): Locator;
    /**
     * Find a button by text.
     *
     * @view
     * <button>Save</button>
     *
     * @example
     * element(by.buttonText('Save'));
     *
     * @param {string} searchText
     * @returns {Locator} location strategy
     */
    buttonText(searchText: string): Locator;
    /**
     * Find a button by partial text.
     *
     * @view
     * <button>Save my file</button>
     *
     * @example
     * element(by.partialButtonText('Save'));
     *
     * @param {string} searchText
     * @returns {Locator} location strategy
     */
    partialButtonText(searchText: string): Locator;
    private byRepeaterInner(exact, repeatDescriptor);
    /**
     * Find elements inside an ng-repeat.
     *
     * @view
     * <div ng-repeat="cat in pets">
     *   <span>{{cat.name}}</span>
     *   <span>{{cat.age}}</span>
     * </div>
     *
     * <div class="book-img" ng-repeat-start="book in library">
     *   <span>{{$index}}</span>
     * </div>
     * <div class="book-info" ng-repeat-end>
     *   <h4>{{book.name}}</h4>
     *   <p>{{book.blurb}}</p>
     * </div>
     *
     * @example
     * // Returns the DIV for the second cat.
     * var secondCat = element(by.repeater('cat in pets').row(1));
     *
     * // Returns the SPAN for the first cat's name.
     * var firstCatName = element(by.repeater('cat in pets').
     *     row(0).column('cat.name'));
     *
     * // Returns a promise that resolves to an array of WebElements from a column
     * var ages = element.all(
     *     by.repeater('cat in pets').column('cat.age'));
     *
     * // Returns a promise that resolves to an array of WebElements containing
     * // all top level elements repeated by the repeater. For 2 pets rows
     * // resolves to an array of 2 elements.
     * var rows = element.all(by.repeater('cat in pets'));
     *
     * // Returns a promise that resolves to an array of WebElements containing
     * // all the elements with a binding to the book's name.
     * var divs = element.all(by.repeater('book in library').column('book.name'));
     *
     * // Returns a promise that resolves to an array of WebElements containing
     * // the DIVs for the second book.
     * var bookInfo = element.all(by.repeater('book in library').row(1));
     *
     * // Returns the H4 for the first book's name.
     * var firstBookName = element(by.repeater('book in library').
     *     row(0).column('book.name'));
     *
     * // Returns a promise that resolves to an array of WebElements containing
     * // all top level elements repeated by the repeater. For 2 books divs
     * // resolves to an array of 4 elements.
     * var divs = element.all(by.repeater('book in library'));
     *
     * @param {string} repeatDescriptor
     * @returns {Locator} location strategy
     */
    repeater(repeatDescriptor: string): Locator;
    /**
     * Find an element by exact repeater.
     *
     * @view
     * <li ng-repeat="person in peopleWithRedHair"></li>
     * <li ng-repeat="car in cars | orderBy:year"></li>
     *
     * @example
     * expect(element(by.exactRepeater('person in
     * peopleWithRedHair')).isPresent())
     *     .toBe(true);
     * expect(element(by.exactRepeater('person in
     * people')).isPresent()).toBe(false);
     * expect(element(by.exactRepeater('car in cars')).isPresent()).toBe(true);
     *
     * @param {string} repeatDescriptor
     * @returns {Locator} location strategy
     */
    exactRepeater(repeatDescriptor: string): Locator;
    /**
     * Find elements by CSS which contain a certain string.
     *
     * @view
     * <ul>
     *   <li class="pet">Dog</li>
     *   <li class="pet">Cat</li>
     * </ul>
     *
     * @example
     * // Returns the li for the dog, but not cat.
     * var dog = element(by.cssContainingText('.pet', 'Dog'));
     *
     * @param {string} cssSelector css selector
     * @param {string} searchString text search
     * @returns {Locator} location strategy
     */
    cssContainingText(cssSelector: string, searchText: string): Locator;
    /**
     * Find an element by ng-options expression.
     *
     * @alias by.options(optionsDescriptor)
     * @view
     * <select ng-model="color" ng-options="c for c in colors">
     *   <option value="0" selected="selected">red</option>
     *   <option value="1">green</option>
     * </select>
     *
     * @example
     * var allOptions = element.all(by.options('c for c in colors'));
     * expect(allOptions.count()).toEqual(2);
     * var firstOption = allOptions.first();
     * expect(firstOption.getText()).toEqual('red');
     *
     * @param {string} optionsDescriptor ng-options expression.
     * @returns {Locator} location strategy
     */
    options(optionsDescriptor: string): Locator;
    /**
     * Find an element by css selector within the Shadow DOM.
     *
     * @alias by.deepCss(selector)
     * @view
     * <div>
     *   <span id="outerspan">
     *   <"shadow tree">
     *     <span id="span1"></span>
     *     <"shadow tree">
     *       <span id="span2"></span>
     *     </>
     *   </>
     * </div>
     * @example
     * var spans = element.all(by.deepCss('span'));
     * expect(spans.count()).toEqual(3);
     *
     * @param {string} selector a css selector within the Shadow DOM.
     * @returns {Locator} location strategy
     */
    deepCss(selector: string): Locator;
}

/**
 * Represents a library of canned expected conditions that are useful for
 * protractor, especially when dealing with non-angular apps.
 *
 * Each condition returns a function that evaluates to a promise. You may mix
 * multiple conditions using `and`, `or`, and/or `not`. You may also
 * mix these conditions with any other conditions that you write.
 *
 * See ExpectedCondition Class in Selenium WebDriver codebase.
 * http://seleniumhq.github.io/selenium/docs/api/java/org/openqa/selenium/support/ui/ExpectedConditions.html
 *
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * var button = $('#xyz');
 * var isClickable = EC.elementToBeClickable(button);
 *
 * browser.get(URL);
 * browser.wait(isClickable, 5000); //wait for an element to become clickable
 * button.click();
 *
 * // You can define your own expected condition, which is a function that
 * // takes no parameter and evaluates to a promise of a boolean.
 * var urlChanged = function() {
 *   return browser.getCurrentUrl().then(function(url) {
 *     return url === 'http://www.angularjs.org';
 *   });
 * };
 *
 * // You can customize the conditions with EC.and, EC.or, and EC.not.
 * // Here's a condition to wait for url to change, $('abc') element to contain
 * // text 'bar', and button becomes clickable.
 * var condition = EC.and(urlChanged, EC.textToBePresentInElement($('abc'),
 * 'bar'), isClickable);
 * browser.get(URL);
 * browser.wait(condition, 5000); //wait for condition to be true.
 * button.click();
 *
 * @alias ExpectedConditions
 * @constructor
 */
export  class ProtractorExpectedConditions {
    /**
     * Negates the result of a promise.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * var titleIsNotFoo = EC.not(EC.titleIs('Foo'));
     * // Waits for title to become something besides 'foo'.
     * browser.wait(titleIsNotFoo, 5000);
     *
     * @alias ExpectedConditions.not
     * @param {!function} expectedCondition
     *
     * @returns {!function} An expected condition that returns the negated value.
     */
    not(expectedCondition: Function): Function;
    /**
     * Helper function that is equivalent to the logical_and if defaultRet==true,
     * or logical_or if defaultRet==false
     *
     * @private
     * @param {boolean} defaultRet
     * @param {Array.<Function>} fns An array of expected conditions to chain.
     *
     * @returns {!function} An expected condition that returns a promise which
     *     evaluates to the result of the logical chain.
     */
    logicalChain_(defaultRet: boolean, fns: Array<Function>): Function;
    /**
     * Chain a number of expected conditions using logical_and, short circuiting
     * at the first expected condition that evaluates to false.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * var titleContainsFoo = EC.titleContains('Foo');
     * var titleIsNotFooBar = EC.not(EC.titleIs('FooBar'));
     * // Waits for title to contain 'Foo', but is not 'FooBar'
     * browser.wait(EC.and(titleContainsFoo, titleIsNotFooBar), 5000);
     *
     * @alias ExpectedConditions.and
     * @param {Array.<Function>} fns An array of expected conditions to 'and'
     * together.
     *
     * @returns {!function} An expected condition that returns a promise which
     *     evaluates to the result of the logical and.
     */
    and(...args: Function[]): Function;
    /**
     * Chain a number of expected conditions using logical_or, short circuiting
     * at the first expected condition that evaluates to true.
     *
     * @alias ExpectedConditions.or
     * @example
     * var EC = protractor.ExpectedConditions;
     * var titleContainsFoo = EC.titleContains('Foo');
     * var titleContainsBar = EC.titleContains('Bar');
     * // Waits for title to contain either 'Foo' or 'Bar'
     * browser.wait(EC.or(titleContainsFoo, titleContainsBar), 5000);
     *
     * @param {Array.<Function>} fns An array of expected conditions to 'or'
     * together.
     *
     * @returns {!function} An expected condition that returns a promise which
     *     evaluates to the result of the logical or.
     */
    or(...args: Function[]): Function;
    /**
     * Expect an alert to be present.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for an alert pops up.
     * browser.wait(EC.alertIsPresent(), 5000);
     *
     * @alias ExpectedConditions.alertIsPresent
     * @returns {!function} An expected condition that returns a promise
     *     representing whether an alert is present.
     */
    alertIsPresent(): Function;
    /**
     * An Expectation for checking an element is visible and enabled such that you
     * can click it.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the element with id 'abc' to be clickable.
     * browser.wait(EC.elementToBeClickable($('#abc')), 5000);
     *
     * @alias ExpectedConditions.elementToBeClickable
     * @param {!ElementFinder} elementFinder The element to check
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the element is clickable.
     */
    elementToBeClickable(elementFinder: ElementFinder): Function;
    /**
     * An expectation for checking if the given text is present in the
     * element. Returns false if the elementFinder does not find an element.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the element with id 'abc' to contain the text 'foo'.
     * browser.wait(EC.textToBePresentInElement($('#abc'), 'foo'), 5000);
     *
     * @alias ExpectedConditions.textToBePresentInElement
     * @param {!ElementFinder} elementFinder The element to check
     * @param {!string} text The text to verify against
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the text is present in the element.
     */
    textToBePresentInElement(elementFinder: ElementFinder, text: string): Function;
    /**
     * An expectation for checking if the given text is present in the element’s
     * value. Returns false if the elementFinder does not find an element.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the element with id 'myInput' to contain the input 'foo'.
     * browser.wait(EC.textToBePresentInElementValue($('#myInput'), 'foo'), 5000);
     *
     * @alias ExpectedConditions.textToBePresentInElement
     * @param {!ElementFinder} elementFinder The element to check
     * @param {!string} text The text to verify against
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the text is present in the element's value.
     */
    textToBePresentInElementValue(elementFinder: ElementFinder, text: string): Function;
    /**
     * An expectation for checking that the title contains a case-sensitive
     * substring.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the title to contain 'foo'.
     * browser.wait(EC.titleContains('foo'), 5000);
     *
     * @alias ExpectedConditions.titleContains
     * @param {!string} title The fragment of title expected
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the title contains the string.
     */
    titleContains(title: string): Function;
    /**
     * An expectation for checking the title of a page.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the title to be 'foo'.
     * browser.wait(EC.titleIs('foo'), 5000);
     *
     * @alias ExpectedConditions.titleIs
     * @param {!string} title The expected title, which must be an exact match.
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the title equals the string.
     */
    titleIs(title: string): Function;
    /**
     * An expectation for checking that the URL contains a case-sensitive
     * substring.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the URL to contain 'foo'.
     * browser.wait(EC.urlContains('foo'), 5000);
     *
     * @alias ExpectedConditions.urlContains
     * @param {!string} url The fragment of URL expected
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the URL contains the string.
     */
    urlContains(url: string): Function;
    /**
     * An expectation for checking the URL of a page.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the URL to be 'foo'.
     * browser.wait(EC.urlIs('foo'), 5000);
     *
     * @alias ExpectedConditions.urlIs
     * @param {!string} url The expected URL, which must be an exact match.
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the url equals the string.
     */
    urlIs(url: string): Function;
    /**
     * An expectation for checking that an element is present on the DOM
     * of a page. This does not necessarily mean that the element is visible.
     * This is the opposite of 'stalenessOf'.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the element with id 'abc' to be present on the dom.
     * browser.wait(EC.presenceOf($('#abc')), 5000);
     *
     * @alias ExpectedConditions.presenceOf
     * @param {!ElementFinder} elementFinder The element to check
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the element is present.
     */
    presenceOf(elementFinder: ElementFinder): Function;
    /**
     * An expectation for checking that an element is not attached to the DOM
     * of a page. This is the opposite of 'presenceOf'.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the element with id 'abc' to be no longer present on the dom.
     * browser.wait(EC.stalenessOf($('#abc')), 5000);
     *
     * @alias ExpectedConditions.stalenessOf
     * @param {!ElementFinder} elementFinder The element to check
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the element is stale.
     */
    stalenessOf(elementFinder: ElementFinder): Function;
    /**
     * An expectation for checking that an element is present on the DOM of a
     * page and visible. Visibility means that the element is not only displayed
     * but also has a height and width that is greater than 0. This is the
     * opposite
     * of 'invisibilityOf'.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the element with id 'abc' to be visible on the dom.
     * browser.wait(EC.visibilityOf($('#abc')), 5000);
     *
     * @alias ExpectedConditions.visibilityOf
     * @param {!ElementFinder} elementFinder The element to check
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the element is visible.
     */
    visibilityOf(elementFinder: ElementFinder): Function;
    /**
     * An expectation for checking that an element is either invisible or not
     * present on the DOM. This is the opposite of 'visibilityOf'.
     *
     * @example
     * var EC = protractor.ExpectedConditions;
     * // Waits for the element with id 'abc' to be no longer visible on the dom.
     * browser.wait(EC.invisibilityOf($('#abc')), 5000);
     *
     * @alias ExpectedConditions.invisibilityOf
     * @param {!ElementFinder} elementFinder The element to check
     *
     * @returns {!function} An expected condition that returns a promise
     *     representing whether the element is invisible.
     */
    invisibilityOf(elementFinder: ElementFinder): Function;
    /**
   * An expectation for checking the selection is selected.
   *
   * @example
   * var EC = protractor.ExpectedConditions;
   * // Waits for the element with id 'myCheckbox' to be selected.
   * browser.wait(EC.elementToBeSelected($('#myCheckbox')), 5000);
   *
   * @alias ExpectedConditions.elementToBeSelected
   * @param {!ElementFinder} elementFinder The element to check
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the element is selected.
   */
    elementToBeSelected(elementFinder: ElementFinder): Function;
}

export interface Config {
    /**
     * The location of the standalone Selenium Server jar file, relative
     * to the location of webdriver-manager. If no other method of starting
     * Selenium Server is found, this will default to
     * node_modules/protractor/node_modules/webdriver-manager/selenium/<jar file>
     */
    seleniumServerJar?: string;
    /**
     * Can be an object which will be passed to the SeleniumServer class as args.
     * See a full list of options at
     * https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/remote/index.js
     * If you specify `args` or `port` in this object, it will overwrite the
     * values set via the deprecated config values `seleniumPort` and
     * `seleniumArgs`.
     */
    localSeleniumStandaloneOpts?: {
        /**
         * The port to start the Selenium Server on, or null if the server should
         * find its own unused port.
         */
        port?: any;
        /**
         * Additional command line options to pass to selenium. For example,
         * if you need to change the browser timeout, use
         * seleniumArgs: ['-browserTimeout=60']
         */
        args?: any;
    };
    /**
     * ChromeDriver location is used to help find the chromedriver binary.
     * This will be passed to the Selenium jar as the system property
     * webdriver.chrome.driver. If null, Selenium will attempt to find
     * ChromeDriver using PATH.
     *
     * example:
     * chromeDriver: './node_modules/webdriver-manager/selenium/chromedriver_2.20'
     */
    chromeDriver?: string;
    /**
     * The address of a running Selenium Server. If specified, Protractor will
     * connect to an already running instance of Selenium. This usually looks like
     * seleniumAddress: 'http://localhost:4444/wd/hub'
     */
    seleniumAddress?: string;
    /**
     * The selenium session id allows Protractor to attach to an existing selenium
     * browser session. The selenium session is maintained after the test has
     * completed. Ignored if seleniumAddress is null.
     */
    seleniumSessionId?: string;
    /**
     * The address of a proxy server to use for the connection to the
     * Selenium Server. If not specified no proxy is configured. Looks like
     * webDriverProxy: 'http://localhost:3128'
     */
    webDriverProxy?: string;
    /**
     * If the sauceUser and sauceKey are specified, seleniumServerJar will be
     * ignored. The tests will be run remotely using Sauce Labs.
     */
    sauceUser?: string;
    /**
     * If the sauceUser and sauceKey are specified, seleniumServerJar will be
     * ignored. The tests will be run remotely using Sauce Labs.
     */
    sauceKey?: string;
    /**
     * Use sauceAgent if you need customize agent for https connection to
     * saucelabs.com (i.e. your computer behind corporate proxy)
     */
    sauceAgent?: string;
    /**
     * Use sauceBuild if you want to group test capabilites by a build ID
     */
    sauceBuild?: string;
    /**
     * Use sauceSeleniumAddress if you need to customize the URL Protractor
     * uses to connect to sauce labs (for example, if you are tunneling selenium
     * traffic through a sauce connect tunnel). Default is
     * ondemand.saucelabs.com:80/wd/hub
     */
    sauceSeleniumAddress?: string;
    /**
     * If browserstackUser and browserstackKey are specified, seleniumServerJar
     * will be ignored. The tests will be run remotely using BrowserStack.
     */
    browserstackUser?: string;
    /**
     * If browserstackUser and browserstackKey are specified, seleniumServerJar
     * will be ignored. The tests will be run remotely using BrowserStack.
     */
    browserstackKey?: string;
    /**
     * If true, Protractor will connect directly to the browser Drivers
     * at the locations specified by chromeDriver and firefoxPath. Only Chrome
     * and Firefox are supported for direct connect.
     *
     * default: false
     */
    directConnect?: boolean;
    /**
     * Path to the firefox application binary. If null, will attempt to find
     * firefox in the default locations.
     */
    firefoxPath?: string;
    /**
     * Use default globals: 'protractor', 'browser', '$', '$$', 'element', 'by'.
     * These also exist as properties of the protractor namespace:
     * 'protractor.browser', 'protractor.$', 'protractor.$$',
     * 'protractor.element', 'protractor.by', and 'protractor.By'.
     *
     * When no globals is set to true, the only available global variable will be
     * 'protractor'.
     */
    noGlobals?: boolean;
    /**
     * Required. Spec patterns are relative to the location of this config.
     *
     * Example:
     * specs: [
     *   'spec/*_spec.js'
     * ]
     */
    specs?: Array<string>;
    /**
     * Patterns to exclude specs.
     */
    exclude?: Array<string> | string;
    /**
     * Alternatively, suites may be used. When run without a command line
     * parameter, all suites will run. If run with --suite=smoke or
     * --suite=smoke,full only the patterns matched by the specified suites will
     * run.
     *
     * Example:
     * suites: {
     *   smoke: 'spec/smoketests/*.js',
     *   full: 'spec/*.js'
     * }
     */
    suites?: any;
    /**
     * If you would like protractor to use a specific suite by default instead of
     * all suites, you can put that in the config file as well.
     */
    suite?: string;
    /**
     * Protractor can launch your tests on one or more browsers. If you are
     * testing on a single browser, use the capabilities option. If you are
     * testing on multiple browsers, use the multiCapabilities array.
     *
     * For a list of available capabilities, see
     * https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
     * In addition, you may specify count, shardTestFiles, and maxInstances.
     *
     * Example:
     * capabilities: {
     *   browserName: 'chrome',
     *   name: 'Unnamed Job',
     *   logName: 'Chrome - English',
     *   count: 1,
     *   shardTestFiles: false,
     *   maxInstances: 1,
     *   specs: ['spec/chromeOnlySpec.js'],
     *   exclude: ['spec/doNotRunInChromeSpec.js'],
     *   seleniumAddress: 'http://localhost:4444/wd/hub'
     * }
     */
    capabilities?: {
        [key: string]: any;
        browserName?: string;
        /**
         * Name of the process executing this capability.  Not used directly by
         * protractor or the browser, but instead pass directly to third parties
         * like BrowserStack and SauceLabs as the name of the job running this
         * test
         */
        name?: string;
        /**
         * User defined name for the capability that will display in the results
         * log. Defaults to the browser name
         */
        logName?: string;
        /**
         * Number of times to run this set of capabilities (in parallel, unless
         * limited by maxSessions). Default is 1.
         */
        count?: number;
        /**
         * If this is set to be true, specs will be sharded by file (i.e. all
         * files to be run by this set of capabilities will run in parallel).
         * Default is false.
         */
        shardTestFiles?: boolean;
        /**
         * Maximum number of browser instances that can run in parallel for this
         * set of capabilities. This is only needed if shardTestFiles is true.
         * Default is 1.
         */
        maxInstances?: number;
        /**
         * Additional spec files to be run on this capability only.
         */
        specs?: string[];
        /**
         * Spec files to be excluded on this capability only.
         */
        exclude?: string[];
        /**
         * Optional: override global seleniumAddress on this capability only.
         */
        seleniumAddress?: string;
    };
    /**
     * If you would like to run more than one instance of WebDriver on the same
     * tests, use multiCapabilities, which takes an array of capabilities.
     * If this is specified, capabilities will be ignored.
     */
    multiCapabilities?: Array<any>;
    /**
     * If you need to resolve multiCapabilities asynchronously (i.e. wait for
     * server/proxy, set firefox profile, etc), you can specify a function here
     * which will return either `multiCapabilities` or a promise to
     * `multiCapabilities`.
     *
     * If this returns a promise, it is resolved immediately after
     * `beforeLaunch` is run, and before any driver is set up. If this is
     * specified, both capabilities and multiCapabilities will be ignored.
     */
    getMultiCapabilities?: any;
    /**
     * Maximum number of total browser sessions to run. Tests are queued in
     * sequence if number of browser sessions is limited by this parameter.
     * Use a number less than 1 to denote unlimited. Default is unlimited.
     */
    maxSessions?: number;
    /**
     * A base URL for your application under test. Calls to protractor.get()
     * with relative paths will be resolved against this URL (via url.resolve)
     */
    baseUrl?: string;
    /**
     * CSS Selector for the element housing the angular app - this defaults to
     * 'body', but is necessary if ng-app is on a descendant of <body>.
     */
    rootElement?: string;
    /**
     * The timeout in milliseconds for each script run on the browser. This
     * should be longer than the maximum time your application needs to
     * stabilize between tasks.
     */
    allScriptsTimeout?: number;
    /**
     * How long to wait for a page to load.
     */
    getPageTimeout?: number;
    /**
     * A callback function called once configs are read but before any
     * environment setup. This will only run once, and before onPrepare.
     *
     * You can specify a file containing code to run by setting beforeLaunch to
     * the filename string.
     *
     * At this point, global variable 'protractor' object will NOT be set up,
     * and globals from the test framework will NOT be available. The main
     * purpose of this function should be to bring up test dependencies.
     */
    beforeLaunch?: () => {};
    /**
     * A callback function called once protractor is ready and available, and
     * before the specs are executed. If multiple capabilities are being run,
     * this will run once per capability.
     *
     * You can specify a file containing code to run by setting onPrepare to
     * the filename string. onPrepare can optionally return a promise, which
     * Protractor will wait for before continuing execution. This can be used if
     * the preparation involves any asynchronous calls, e.g. interacting with
     * the browser. Otherwise Protractor cannot guarantee order of execution
     * and may start the tests before preparation finishes.
     *
     * At this point, global variable 'protractor' object will be set up, and
     * globals from the test framework will be available. For example, if you
     * are using Jasmine, you can add a reporter with:
     *
     *    jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
     *      'outputdir/', true, true));
     *
     * If you need access back to the current configuration object,
     * use a pattern like the following:
     *
     *    return browser.getProcessedConfig().then(function(config) {
     *      // config.capabilities is the CURRENT capability being run, if
     *      // you are using multiCapabilities.
     *      console.log('Executing capability', config.capabilities);
     *    });
     */
    onPrepare?: () => {};
    /**
     * A callback function called once tests are finished. onComplete can
     * optionally return a promise, which Protractor will wait for before
     * shutting down webdriver.
     *
     * At this point, tests will be done but global objects will still be
     * available.
     */
    onComplete?: () => {};
    /**
     * A callback function called once the tests have finished running and
     * the WebDriver instance has been shut down. It is passed the exit code
     * (0 if the tests passed). This is called once per capability.
     */
    onCleanUp?: (exitCode: number) => {};
    /**
     * A callback function called once all tests have finished running and
     * the WebDriver instance has been shut down. It is passed the exit code
     * (0 if the tests passed). afterLaunch must return a promise if you want
     * asynchronous code to be executed before the program exits.
     * This is called only once before the program exits (after onCleanUp).
     */
    afterLaunch?: (exitCode: number) => {};
    /**
     * The params object will be passed directly to the Protractor instance,
     * and can be accessed from your test as browser.params. It is an arbitrary
     * object and can contain anything you may need in your test.
     * This can be changed via the command line as:
     *   --params.login.user "Joe"
     *
     * Example:
     * params: {
     *   login: {
     *     user: 'Jane',
     *     password: '1234'
     *   }
     * }
     */
    params?: any;
    /**
     * If set, protractor will save the test output in json format at this path.
     * The path is relative to the location of this config.
     */
    resultJsonOutputFile?: any;
    /**
     * If true, protractor will restart the browser between each test. Default
     * value is false.
     *
     * CAUTION: This will cause your tests to slow down drastically.
     */
    restartBrowserBetweenTests?: boolean;
    /**
     * Protractor will track outstanding $timeouts by default, and report them
     * in the error message if Protractor fails to synchronize with Angular in
     * time. In order to do this Protractor needs to decorate $timeout.
     *
     * CAUTION: If your app decorates $timeout, you must turn on this flag. This
     * is false by default.
     */
    untrackOutstandingTimeouts?: boolean;
    /**
     * Test framework to use. This may be one of: jasmine, mocha or custom.
     * Default value is 'jasmine'
     *
     * When the framework is set to "custom" you'll need to additionally
     * set frameworkPath with the path relative to the config file or absolute:
     *
     *   framework: 'custom',
     *   frameworkPath: './frameworks/my_custom_jasmine.js',
     *
     * See github.com/angular/protractor/blob/master/lib/frameworks/README.md
     * to comply with the interface details of your custom implementation.
     *
     * Jasmine is fully supported as test and assertion frameworks.
     * Mocha has limited support. You will need to include your
     * own assertion framework (such as Chai) if working with Mocha.
     */
    framework?: string;
    /**
     * Options to be passed to jasmine.
     *
     * See https://github.com/jasmine/jasmine-npm/blob/master/lib/jasmine.js
     * for the exact options available.
     */
    jasmineNodeOpts?: {
        [key: string]: any;
        /**
         * If true, print colors to the terminal.
         */
        showColors?: boolean;
        /**
         * Default time to wait in ms before a test fails.
         */
        defaultTimeoutInterval?: number;
        /**
         * Function called to print jasmine results.
         */
        print?: () => {};
        /**
         * If set, only execute specs whose names match the pattern, which is
         * internally compiled to a RegExp.
         */
        grep?: string;
        /**
         * Inverts 'grep' matches
         */
        invertGrep?: boolean;
    };
    /**
     * Options to be passed to Mocha.
     *
     * See the full list at http://mochajs.org/
     */
    mochaOpts?: {
        [key: string]: any;
        ui?: string;
        reporter?: string;
    };
    /**
     * Options to be passed to Cucumber (when set up as a custom framework).
     */
    cucumberOpts?: {
        [key: string]: any;
        /**
         * Require files before executing the features.
         */
        require?: string;
        /**
         * Only execute the features or scenarios with tags matching @dev.
         * This may be an array of strings to specify multiple tags to include.
         */
        tags?: string;
        /**
         * How to format features (default: progress)
         */
        format?: string;
        coffee?: any;
        noSnippets?: any;
        dryRun?: any;
    };
    /**
     * See docs/plugins.md
     */
    plugins?: Array<any>;
    /**
     * Turns off source map support.  Stops protractor from registering global
     * variable `source-map-support`.  Defaults to `false`
     */
    skipSourceMapSupport?: boolean;
    /**
     * Turns off WebDriver's environment variables overrides to ignore any
     * environment variable and to only use the configuration in this file.
     * Defaults to `false`
     */
    disableEnvironmentOverrides?: boolean;
    seleniumArgs?: Array<any>;
    configDir?: string;
    troubleshoot?: boolean;
    seleniumPort?: number;
    mockSelenium?: boolean;
    v8Debug?: any;
    nodeDebug?: boolean;
    debuggerServerPort?: number;
    useAllAngular2AppRoots?: boolean;
    frameworkPath?: string;
    elementExplorer?: any;
    debug?: boolean;
}


}
declare module "protractor" {
  export = protractor; 
}
