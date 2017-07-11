// Used to provide better protractor documentation for webdriver. These files
// are not used to provide code for protractor and are only used for the website.

/**
 * @fileoverview The heart of the WebDriver JavaScript API.
 */

goog.provide('webdriver');

/**
 * Class for defining sequences of complex user interactions.
 * @external webdriver.ActionSequence
 * @see http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/actions_exports_ActionSequence.html
 */
webdriver.ActionSequence = function() {};

/**
 * Class for defining sequences of user touch interactions.
 * @external webdriver.TouchSequence
 * @see http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_TouchSequence.html
 */
webdriver.TouchSequence = function() {};

// //////////////////////////////////////////////////////////////////////////////
// //
// //  webdriver.WebDriver
// //
// /////////////////////////////////////////////////////////////////////////////
/**
 * Protractor's `browser` object is a wrapper for `selenium-webdriver` WebDriver.
 * It inherits call of WebDriver's methods, but only the methods most useful to
 * Protractor users are documented here.
 *
 * A full list of all functions available on WebDriver can be found
 * in the selenium-webdriver
 * <a href="http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html">documentation</a>
 * @constructor
 */
webdriver.WebDriver = function() {};

/**
 * Creates a sequence of user actions using this driver. The sequence will not be
 * scheduled for execution until {@link webdriver.ActionSequence#perform} is
 * called.
 *
 * See the selenium webdriver docs <a href="http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/actions_exports_ActionSequence.html">
 * for more details on action sequences</a>.
 *
 * Mouse actions do not work on Chrome with the HTML5 Drag and Drop API due to a known <a href="https://bugs.chromium.org/p/chromedriver/issues/detail?id=841">
 *   Chromedriver issue</a>
 *
 * @example
 * // Dragging one element to another.
 * browser.actions().
 *     mouseDown(element1).
 *     mouseMove(element2).
 *     mouseUp().
 *     perform();
 *
 * // You can also use the `dragAndDrop` convenience action.
 * browser.actions().
 *     dragAndDrop(element1, element2).
 *     perform();
 *
 * // Instead of specifying an element as the target, you can specify an offset
 * // in pixels. This example double-clicks slightly to the right of an element.
 * browser.actions().
 *     mouseMove(element).
 *     mouseMove({x: 50, y: 0}).
 *     doubleClick().
 *     perform();
 *
 * @returns {!webdriver.ActionSequence} A new action sequence for this instance.
 */
webdriver.WebDriver.prototype.actions = function() {};

/**
 * Creates a new touch sequence using this driver. The sequence will not be
 * scheduled for execution until {@link actions.TouchSequence#perform} is
 * called.
 *
 * See the selenium webdriver docs <a href="http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_TouchSequence.html">
 * for more details on touch sequences</a>.
 *
 * @example
 * browser.touchActions().
 *     tap(element1).
 *     doubleTap(element2).
 *     perform();
 *
 * @return {!webdriver.TouchSequence} A new touch sequence for this instance.
 */
webdriver.WebDriver.prototype.touchActions = function() {};

/**
 * Schedules a command to execute JavaScript in the context of the currently
 * selected frame or window. The script fragment will be executed as the body
 * of an anonymous function. If the script is provided as a function object,
 * that function will be converted to a string for injection into the target
 * window.
 *
 * Any arguments provided in addition to the script will be included as script
 * arguments and may be referenced using the {@code arguments} object.
 * Arguments may be a boolean, number, string, or {@linkplain WebElement}.
 * Arrays and objects may also be used as script arguments as long as each item
 * adheres to the types previously mentioned.
 *
 * The script may refer to any variables accessible from the current window.
 * Furthermore, the script will execute in the window's context, thus
 * {@code document} may be used to refer to the current document. Any local
 * variables will not be available once the script has finished executing,
 * though global variables will persist.
 *
 * If the script has a return value (i.e. if the script contains a return
 * statement), then the following steps will be taken for resolving this
 * functions return value:
 *
 * - For a HTML element, the value will resolve to a {@linkplain WebElement}
 * - Null and undefined return values will resolve to null</li>
 * - Booleans, numbers, and strings will resolve as is</li>
 * - Functions will resolve to their string representation</li>
 * - For arrays and objects, each member item will be converted according to
 *     the rules above
 *
 * @example
 * var el = element(by.module('header'));
 * var tag = browser.executeScript('return arguments[0].tagName', el);
 * expect(tag).toEqual('h1');
 *
 * @param {!(string|Function)} script The script to execute.
 * @param {...*} var_args The arguments to pass to the script.
 * @return {!promise.Promise<T>} A promise that will resolve to the
 *    scripts return value.
 * @template T
 */
webdriver.WebDriver.prototype.executeScript = function(script, var_args) {};

/**
 * Schedules a command to execute asynchronous JavaScript in the context of the
 * currently selected frame or window. The script fragment will be executed as
 * the body of an anonymous function. If the script is provided as a function
 * object, that function will be converted to a string for injection into the
 * target window.
 *
 * Any arguments provided in addition to the script will be included as script
 * arguments and may be referenced using the {@code arguments} object.
 * Arguments may be a boolean, number, string, or {@code WebElement}.
 * Arrays and objects may also be used as script arguments as long as each item
 * adheres to the types previously mentioned.
 *
 * Unlike executing synchronous JavaScript with {@link #executeScript},
 * scripts executed with this function must explicitly signal they are finished
 * by invoking the provided callback. This callback will always be injected
 * into the executed function as the last argument, and thus may be referenced
 * with {@code arguments[arguments.length - 1]}. The following steps will be
 * taken for resolving this functions return value against the first argument
 * to the script's callback function:
 *
 * - For a HTML element, the value will resolve to a
 *     {@link WebElement}
 * - Null and undefined return values will resolve to null
 * - Booleans, numbers, and strings will resolve as is
 * - Functions will resolve to their string representation
 * - For arrays and objects, each member item will be converted according to
 *     the rules above
 *
 * @example
 * // Example 1
 * // Performing a sleep that is synchronized with the currently selected window
 * var start = new Date().getTime();
 * browser.executeAsyncScript(
 *     'window.setTimeout(arguments[arguments.length - 1], 500);').
 *     then(function() {
 *       console.log(
 *           'Elapsed time: ' + (new Date().getTime() - start) + ' ms');
 *     });
 *
 * // Example 2
 * // Synchronizing a test with an AJAX application:
 * var button = element(by.id('compose-button'));
 * button.click();
 * browser.executeAsyncScript(
 *     'var callback = arguments[arguments.length - 1];' +
 *     'mailClient.getComposeWindowWidget().onload(callback);');
 * browser.switchTo().frame('composeWidget');
 * element(by.id('to')).sendKeys('dog@example.com');
 *
 * // Example 3
 * // Injecting a XMLHttpRequest and waiting for the result.  In this example,
 * // the inject script is specified with a function literal. When using this
 * // format, the function is converted to a string for injection, so it should
 * // not reference any symbols not defined in the scope of the page under test.
 * browser.executeAsyncScript(function() {
 *   var callback = arguments[arguments.length - 1];
 *   var xhr = new XMLHttpRequest();
 *   xhr.open("GET", "/resource/data.json", true);
 *   xhr.onreadystatechange = function() {
 *     if (xhr.readyState == 4) {
 *       callback(xhr.responseText);
 *     }
 *   };
 *   xhr.send('');
 * }).then(function(str) {
 *   console.log(JSON.parse(str)['food']);
 * });
 *
 * @param {!(string|Function)} script The script to execute.
 * @param {...*} var_args The arguments to pass to the script.
 * @return {!promise.Promise<T>} A promise that will resolve to the
 *    scripts return value.
 * @template T
 */
webdriver.WebDriver.prototype.executeAsyncScript = (script, var_args) => {};

/**
 * Schedules a command to execute a custom function within the context of
 * webdriver's control flow.
 *
 * Most webdriver actions are asynchronous, but the control flow makes sure that
 * commands are executed in the order they were received.  By running your
 * function in the control flow, you can ensure that it is executed before/after
 * other webdriver actions.  Additionally, Protractor will wait until the
 * control flow is empty before deeming a test finished.
 *
 * @example
 * var logText = function(el) {
 *   return el.getText().then((text) => {
 *     console.log(text);
 *   });
 * };
 * var counter = element(by.id('counter'));
 * var button = element(by.id('button'));
 * // Use `browser.call()` to make sure `logText` is run before and after
 * // `button.click()`
 * browser.call(logText, counter);
 * button.click();
 * browser.call(logText, counter);
 *
 * @param {function(...): (T|promise.Promise<T>)} fn The function to
 *     execute.
 * @param {Object=} opt_scope The object in whose scope to execute the function
 *     (i.e. the `this` object for the function).
 * @param {...*} var_args Any arguments to pass to the function.  If any of the
 *     arguments are promised, webdriver will wait for these promised to resolve
 *     and pass the resulting value onto the function.
 * @return {!promise.Promise<T>} A promise that will be resolved
 *     with the function's result.
 * @template T
 */
webdriver.WebDriver.prototype.call = function(fn, opt_scope, var_args) {};

/**
 * Schedules a command to wait for a condition to hold or {@link
 * webdriver.promise.Promise promise} to be resolved.
 *
 * This function blocks WebDriver's control flow, not the javascript runtime.
 * It will only delay future webdriver commands from being executed (e.g. it
 * will cause Protractor to wait before sending future commands to the selenium
 * server), and only when the webdriver control flow is enabled.
 *
 * This function returnes a promise, which can be used if you need to block
 * javascript execution and not just the control flow.
 *
 * See also {@link ExpectedConditions}
 *
 * *Example:* Suppose you have a function, `startTestServer`, that returns a
 * promise for when a server is ready for requests. You can block a `WebDriver`
 * client on this promise with:
 *
 * @example
 * var started = startTestServer();
 * browser.wait(started, 5 * 1000, 'Server should start within 5 seconds');
 * browser.get(getServerUrl());
 *
 * @param {!(webdriver.promise.Promise<T>|
 *           webdriver.until.Condition<T>|
 *           function(!webdriver.WebDriver): T)} condition The condition to
 *     wait on, defined as a promise, condition object, or  a function to
 *     evaluate as a condition.
 * @param {number=} opt_timeout How long to wait for the condition to be true. Will default 30 seconds, or to the jasmineNodeOpts.defaultTimeoutInterval in your protractor.conf.js file.
 * @param {string=} opt_message An optional message to use if the wait times
 *     out.
 * @returns {!webdriver.promise.Promise<T>} A promise that will be fulfilled
 *     with the first truthy value returned by the condition function, or
 *     rejected if the condition times out.
 */
webdriver.WebDriver.prototype.wait = function() {};

/**
 * Schedules a command to make the driver sleep for the given amount of time.
 * @param {number} ms The amount of time, in milliseconds, to sleep.
 * @returns {!webdriver.promise.Promise.<void>} A promise that will be resolved
 *     when the sleep has finished.
 */
webdriver.WebDriver.prototype.sleep = function() {};

/**
 * Schedules a command to retrieve the current page's source. The page source
 * returned is a representation of the underlying DOM: do not expect it to be
 * formatted or escaped in the same way as the response sent from the web
 * server.
 * @return {!promise.Promise<string>} A promise that will be
 *     resolved with the current page source.
 */
webdriver.WebDriver.prototype.getPageSource = function() {};

/**
 * Schedules a command to close the current window.
 * @return {!promise.Promise<void>} A promise that will be resolved
 *     when this command has completed.
 */
webdriver.WebDriver.prototype.close = function() {};

/**
 * Schedules a command to retrieve the URL of the current page.
 * @returns {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved with the current URL.
 */
webdriver.WebDriver.prototype.getCurrentUrl = function() {};

/**
 * Schedules a command to retrieve the current page's title.
 * @returns {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved with the current page's title.
 */
webdriver.WebDriver.prototype.getTitle = function() {};

/**
 * Schedule a command to take a screenshot. The driver makes a best effort to
 * return a screenshot of the following, in order of preference:
 * <ol>
 *   <li>Entire page
 *   <li>Current window
 *   <li>Visible portion of the current frame
 *   <li>The screenshot of the entire display containing the browser
 * </ol>
 *
 * @returns {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved to the screenshot as a base-64 encoded PNG.
 */
webdriver.WebDriver.prototype.takeScreenshot = function() {};

/**
 * Used to switch WebDriver's focus to a frame or window (e.g. an alert, an
 * iframe, another window).
 *
 * See [WebDriver's TargetLocator Docs](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_TargetLocator.html)
 * for more information.
 *
 * @example
 * browser.switchTo().frame(element(by.tagName('iframe')).getWebElement());
 *
 * @return {!TargetLocator} The target locator interface for this
 *     instance.
 */
webdriver.WebDriver.prototype.switchTo = function() {}

// /////////////////////////////////////////////////////////////////////////////
// //
// //  webdriver.WebElement
// //
// /////////////////////////////////////////////////////////////////////////////
//
//
//
/**
 * Protractor's ElementFinders are wrappers for selenium-webdriver WebElement.
 * A full list of all functions available on WebElement can be found
 * in the selenium-webdriver
 * <a href="http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html">documentation</a>.
 *
 * @param {!webdriver.WebDriver} driver The webdriver driver or the parent WebDriver instance for this
 *     element.
 * @param {!(webdriver.promise.Promise.<webdriver.WebElement.Id>|
 *           webdriver.WebElement.Id)} id The server-assigned opaque ID for the
 *     underlying DOM element.
 * @constructor
 */
webdriver.WebElement = function(driver, id) {};

/**
 * Gets the parent web element of this web element.
 *
 * @view
 * <ul class="pet">
 *  <li class="dog">Dog</li>
 *  <li class="cat">Cat</li>
 * </ul>
 *
 * @example
 * // Using getDriver to find the parent web element to find the cat li
 * var liDog = element(by.css('.dog')).getWebElement();
 * var liCat = liDog.getDriver().findElement(by.css('.cat'));
 *
 * @returns {!webdriver.WebDriver} The parent driver for this instance.
 */
webdriver.WebElement.prototype.getDriver = function() {};


/**
 * Gets the WebDriver ID string representation for this web element.
 *
 * @view
 * <ul class="pet">
 *   <li class="dog">Dog</li>
 *   <li class="cat">Cat</li>
 * </ul>
 *
 * @example
 * // returns the dog web element
 * var dog = element(by.css('.dog')).getWebElement();
 * expect(dog.getId()).not.toBe(undefined);
 *
 * @returns {!webdriver.promise.Promise.<webdriver.WebElement.Id>} A promise
 *     that resolves to this element's JSON representation as defined by the
 *     WebDriver wire protocol.
 * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol
 */
webdriver.WebElement.prototype.getId = function() {};

/**
 * Use {@link ElementFinder.prototype.element} instead
 *
 * @see ElementFinder.prototype.element
 *
 * @param {webdriver.Locator} subLocator
 *
 * @returns {!webdriver.WebElement}
 */
webdriver.WebElement.prototype.findElement = function(subLocator) {};


/**
 * Schedules a command to click on this element.
 *
 * @view
 * <ul>
 *   <li><a href="https://en.wikipedia.org/wiki/Doge_(meme)">Doge meme</a></li>
 *   <li>Cat</li>
 * </ul>
 *
 * @example
 * // Clicks on the web link
 * element(by.partialLinkText('Doge')).click();
 *
 * @returns {!webdriver.promise.Promise.<void>} A promise that will be resolved
 *     when the click command has completed.
 */
webdriver.WebElement.prototype.click = function() {};


/**
 * Schedules a command to type a sequence on the DOM element represented by this
 * instance.
 *
 * Modifier keys (SHIFT, CONTROL, ALT, META) are stateful; once a modifier is
 * processed in the keysequence, that key state is toggled until one of the
 * following occurs:
 *
 * - The modifier key is encountered again in the sequence. At this point the
 *   state of the key is toggled (along with the appropriate keyup/down events).
 * - The {@link webdriver.Key.NULL} key is encountered in the sequence. When
 *   this key is encountered, all modifier keys current in the down state are
 *   released (with accompanying keyup events). The NULL key can be used to
 *   simulate common keyboard shortcuts:
 *
 *         element.sendKeys("text was",
 *                          protractor.Key.CONTROL, "a", protractor.Key.NULL,
 *                          "now text is");
 *         // Alternatively:
 *         element.sendKeys("text was",
 *                          protractor.Key.chord(protractor.Key.CONTROL, "a"),
 *                          "now text is");
 *
 * - The end of the keysequence is encountered. When there are no more keys
 *   to type, all depressed modifier keys are released (with accompanying keyup
 *   events).
 *
 * If this element is a file input ({@code <input type="file">}), the
 * specified key sequence should specify the path to the file to attach to
 * the element. This is analgous to the user clicking "Browse..." and entering
 * the path into the file select dialog.
 *
 *     var form = driver.findElement(By.css('form'));
 *     var element = form.findElement(By.css('input[type=file]'));
 *     element.sendKeys('/path/to/file.txt');
 *     form.submit();
 *
 * For uploads to function correctly, the entered path must reference a file
 * on the _browser's_ machine, not the local machine running this script. When
 * running against a remote Selenium server, a {@link webdriver.FileDetector}
 * may be used to transparently copy files to the remote machine before
 * attempting to upload them in the browser.
 *
 * __Note:__ On browsers where native keyboard events are not supported
 * (e.g. Firefox on OS X), key events will be synthesized. Special
 * punctionation keys will be synthesized according to a standard QWERTY en-us
 * keyboard layout.
 *
 * @param {...(string|!webdriver.promise.Promise<string>)} var_args The sequence
 *     of keys to type. All arguments will be joined into a single sequence.
 * @returns {!webdriver.promise.Promise.<void>} A promise that will be resolved
 *     when all keys have been typed.
 */
webdriver.WebElement.prototype.sendKeys = function(var_args) {};


/**
 * Gets the tag/node name of this element.
 *
 * @view
 * <span>{{person.name}}</span>
 *
 * @example
 * expect(element(by.binding('person.name')).getTagName()).toBe('span');
 *
 * @returns {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved with the element's tag name.
 */
webdriver.WebElement.prototype.getTagName = function() {};


/**
 * Gets the computed style of an element. If the element inherits the named
 * style from its parent, the parent will be queried for its value. Where
 * possible, color values will be converted to their hex representation (e.g.
 * #00ff00 instead of rgb(0, 255, 0)).
 *
 * _Warning:_ the value returned will be as the browser interprets it, so
 * it may be tricky to form a proper assertion.
 *
 * @view
 * <span style='color: #000000'>{{person.name}}</span>
 *
 * @example
 * expect(element(by.binding('person.name')).getCssValue().indexOf(
 *   'color: #000000')).not.toBe(-1);
 *
 * @param {string} cssStyleProperty The name of the CSS style property to look
 *     up.
 * @returns {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved with the requested CSS value.
 */
webdriver.WebElement.prototype.getCssValue = function(cssStyleProperty) {};


/**
 * Schedules a command to query for the value of the given attribute of the
 * element. Will return the current value, even if it has been modified after
 * the page has been loaded. More exactly, this method will return the value of
 * the given attribute, unless that attribute is not present, in which case the
 * value of the property with the same name is returned. If neither value is
 * set, null is returned (for example, the "value" property of a textarea
 * element). The "style" attribute is converted as best can be to a
 * text representation with a trailing semi-colon. The following are deemed to
 * be "boolean" attributes and will return either "true" or null:
 *
 * async, autofocus, autoplay, checked, compact, complete, controls, declare,
 * defaultchecked, defaultselected, defer, disabled, draggable, ended,
 * formnovalidate, hidden, indeterminate, iscontenteditable, ismap, itemscope,
 * loop, multiple, muted, nohref, noresize, noshade, novalidate, nowrap, open,
 * paused, pubdate, readonly, required, reversed, scoped, seamless, seeking,
 * selected, spellcheck, truespeed, willvalidate
 *
 * Finally, the following commonly mis-capitalized attribute/property names
 * are evaluated as expected:
 *
 * - "class"
 * - "readonly"
 *
 * @view
 * <div id="foo" class="bar"></div>
 *
 * @example
 * var foo = element(by.id('foo'));
 * expect(foo.getAttribute('class')).toEqual('bar');
 *
 * @param {string} attributeName The name of the attribute to query.
 * @returns {!webdriver.promise.Promise.<?string>} A promise that will be
 *     resolved with the attribute's value. The returned value will always be
 *     either a string or null.
 */
webdriver.WebElement.prototype.getAttribute = function(attributeName) {};


/**
 * Get the visible innerText of this element, including sub-elements, without
 * any leading or trailing whitespace. Visible elements are not hidden by CSS.
 *
 * @view
 * <div id="foo" class="bar">Inner text</div>
 *
 * @example
 * var foo = element(by.id('foo'));
 * expect(foo.getText()).toEqual('Inner text');
 *
 * @returns {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved with the element's visible text.
 */
webdriver.WebElement.prototype.getText = function() {};


/**
 * Schedules a command to compute the size of this element's bounding box, in
 * pixels.
 *
 * @view
 * <div id="foo" style="width:50px; height: 20px">
 *   Inner text
 * </div>
 *
 * @example
 * var foo = element(by.id('foo'));
 * expect(foo.getSize()).toEqual(jasmine.objectContaining({
 *  width: 50,
 *  height: 20
 * });
 *
 * @returns {!webdriver.promise.Promise.<{width: number, height: number}>} A
 *     promise that will be resolved with the element's size as a
 *     {@code {width:number, height:number}} object.
 */
webdriver.WebElement.prototype.getSize = function() {};


/**
 * Schedules a command to compute the location of this element in page space.
 *
 * @view
 * <div id="foo" style="position: absolute; top:20px; left: 15px">
 *   Inner text
 * </div>
 *
 * @example
 * var foo = element(by.id('foo'));
 * expect(foo.getLocation()).toEqual(jasmine.objectContaining({
 *  x: 15,
 *  y: 20
 * });
 *
 * @returns {!webdriver.promise.Promise.<{x: number, y: number}>} A promise that
 *     will be resolved to the element's location as a
 *     {@code {x:number, y:number}} object.
 */
webdriver.WebElement.prototype.getLocation = function() {};


/**
 * Schedules a command to query whether the DOM element represented by this
 * instance is enabled, as dicted by the {@code disabled} attribute.
 *
 * @view
 * <input id="foo" disabled=true>
 *
 * @example
 * var foo = element(by.id('foo'));
 * expect(foo.isEnabled()).toBe(false);
 *
 * @returns {!webdriver.promise.Promise.<boolean>} A promise that will be
 *     resolved with whether this element is currently enabled.
 */
webdriver.WebElement.prototype.isEnabled = function() {};


/**
 * Schedules a command to query whether this element is selected.
 *
 * @view
 * <input id="foo" type="checkbox">
 *
 * @example
 * var foo = element(by.id('foo'));
 * expect(foo.isSelected()).toBe(false);
 * foo.click();
 * expect(foo.isSelected()).toBe(true);
 *
 * @returns {!webdriver.promise.Promise.<boolean>} A promise that will be
 *     resolved with whether this element is currently selected.
 */
webdriver.WebElement.prototype.isSelected = function() {};


/**
 * Schedules a command to submit the form containing this element (or this
 * element if it is a FORM element). This command is a no-op if the element is
 * not contained in a form.
 *
 * @view
 * <form id="login">
 *   <input name="user">
 * </form>
 *
 * @example
 * var login_form = element(by.id('login'));
 * login_form.submit();
 *
 * @returns {!webdriver.promise.Promise.<void>} A promise that will be resolved
 *     when the form has been submitted.
 */
webdriver.WebElement.prototype.submit = function() {};


/**
 * Schedules a command to clear the {@code value} of this element. This command
 * has no effect if the underlying DOM element is neither a text INPUT element
 * nor a TEXTAREA element.
 *
 * @view
 * <input id="foo" value="Default Text">
 *
 * @example
 * var foo = element(by.id('foo'));
 * expect(foo.getAttribute('value')).toEqual('Default Text');
 * foo.clear();
 * expect(foo.getAttribute('value')).toEqual('');
 *
 * @returns {!webdriver.promise.Promise.<void>} A promise that will be resolved
 *     when the element has been cleared.
 */
webdriver.WebElement.prototype.clear = function() {};


/**
 * Schedules a command to test whether this element is currently displayed.
 *
 * @view
 * <div id="foo" style="visibility:hidden">
 *
 * @example
 * var foo = element(by.id('foo'));
 * expect(foo.isDisplayed()).toBe(false);
 *
 * @returns {!webdriver.promise.Promise.<boolean>} A promise that will be
 *     resolved with whether this element is currently visible on the page.
 */
webdriver.WebElement.prototype.isDisplayed = function() {};


/**
 * Take a screenshot of the visible region encompassed by this element's
 * bounding rectangle.
 *
 * @view
 * <div id="foo">Inner Text</div>
 *
 * @example
 * function writeScreenShot(data, filename) {
 *   var stream = fs.createWriteStream(filename);
 *   stream.write(new Buffer(data, 'base64'));
 *   stream.end();
 * }
 * var foo = element(by.id('foo'));
 * foo.takeScreenshot().then((png) => {
 *   writeScreenShot(png, 'foo.png');
 * });
 *
 * Note that this is a new feature in WebDriver and may not be supported by
 * your browser's driver. It isn't yet supported in Chromedriver as of 2.21.
 *
 * @param {boolean=} opt_scroll Optional argument that indicates whether the
 *     element should be scrolled into view before taking a screenshot. Defaults
 *     to false.
 * @returns {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved to the screenshot as a base-64 encoded PNG.
 */
webdriver.WebElement.prototype.takeScreenshot = function(opt_scroll) {};
