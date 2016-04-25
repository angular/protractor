// Used to provide better protractor documentation for webdriver. These files
// are not used to provide code for protractor and are only used for the website.

/**
 * @fileoverview The heart of the WebDriver JavaScript API.
 */

goog.provide('webdriver.Alert');
goog.provide('webdriver.AlertPromise');
goog.provide('webdriver.FileDetector');
goog.provide('webdriver.UnhandledAlertError');
goog.provide('webdriver.WebDriver');
goog.provide('webdriver.WebElement');
goog.provide('webdriver.WebElementPromise');

goog.require('bot.Error');
goog.require('bot.ErrorCode');
goog.require('bot.response');
goog.require('goog.array');
goog.require('goog.object');
goog.require('webdriver.ActionSequence');
goog.require('webdriver.Command');
goog.require('webdriver.CommandName');
goog.require('webdriver.Key');
goog.require('webdriver.Locator');
goog.require('webdriver.Serializable');
goog.require('webdriver.Session');
goog.require('webdriver.TouchSequence');
goog.require('webdriver.logging');
goog.require('webdriver.promise');
goog.require('webdriver.until');

// //////////////////////////////////////////////////////////////////////////////
// //
// //  webdriver.WebDriver
// //
// //////////////////////////////////////////////////////////////////////////////
/**
 * Protractor's browser object is a wrapper for selenium-webdriver WebDriver.
 * A full list of all functions available on WebDriver can be found
 * in the selenium-webdriver
 * <a href="http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebDriver.html">documentation</a>
 * @constructor
 */
webdriver.WebDriver = function() {};

/**
 * Creates a new action sequence using this driver. The sequence will not be
 * scheduled for execution until {@link webdriver.ActionSequence#perform} is
 * called.
 *
 * See http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/actions_exports_ActionSequence.html
 * for more examples of action sequences.
 *
 * @example
 * browser.actions().
 *     mouseDown(element1).
 *     mouseMove(element2).
 *     mouseUp().
 *     perform();
 *
 * @return {!webdriver.ActionSequence} A new action sequence for this instance.
 */
webdriver.WebDriver.prototype.actions = function() {};

/**
 * Schedules a command to wait for a condition to hold. 
 *
 * This function may be used to block the command flow on the resolution
 * of a {@link webdriver.promise.Promise promise}. When given a promise, the
 * command will simply wait for its resolution before completing. A timeout may
 * be provided to fail the command if the promise does not resolve before the
 * timeout expires.
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
 * @param {number=} opt_timeout How long to wait for the condition to be true.
 * @param {string=} opt_message An optional message to use if the wait times
 *     out.
 * @return {!webdriver.promise.Promise<T>} A promise that will be fulfilled
 *     with the first truthy value returned by the condition function, or
 *     rejected if the condition times out.
 */
webdriver.WebDriver.prototype.wait = function() {};

/**
 * Schedules a command to make the driver sleep for the given amount of time.
 * @param {number} ms The amount of time, in milliseconds, to sleep.
 * @return {!webdriver.promise.Promise.<void>} A promise that will be resolved
 *     when the sleep has finished.
 */
webdriver.WebDriver.prototype.sleep = function() {};

/**
 * Schedules a command to retrieve the URL of the current page.
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved with the current URL.
 */
webdriver.WebDriver.prototype.getCurrentUrl = function() {};

/**
 * Schedules a command to retrieve the current page's title.
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
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
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved to the screenshot as a base-64 encoded PNG.
 */
webdriver.WebDriver.prototype.takeScreenshot = function() {};

// //////////////////////////////////////////////////////////////////////////////
// //
// //  webdriver.WebElement
// //
// //////////////////////////////////////////////////////////////////////////////
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
 * @return {!webdriver.WebDriver} The parent driver for this instance.
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
 * @return {!webdriver.promise.Promise.<webdriver.WebElement.Id>} A promise
 *     that resolves to this element's JSON representation as defined by the
 *     WebDriver wire protocol.
 * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol
 */
webdriver.WebElement.prototype.getId = function() {};


/**
 * Returns the raw ID string ID for this element.
 * @return {!webdriver.promise.Promise<string>} A promise that resolves to this
 *     element's raw ID as a string value.
 */
webdriver.WebElement.prototype.getRawId = function() {};


/**
 * Returns a promise for the web element's serialized representation.
 *
 * @return {!webdriver.promise.Promise.<webdriver.WebElement.Id>}
 *     This instance's serialized wire format.
 */
webdriver.WebElement.prototype.serialize = function() {};

/**
 * Use {@link ElementFinder.prototype.element} instead
 *
 * @see ElementFinder.prototype.element
 *
 * @param {webdriver.Locator} subLocator
 *
 * @return {!webdriver.WebElement}
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
 * @return {!webdriver.promise.Promise.<void>} A promise that will be resolved
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
 * @return {!webdriver.promise.Promise.<void>} A promise that will be resolved
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
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
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
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
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
 * expect(foo.getAttribute(class)).toEqual('bar');
 *
 * @param {string} attributeName The name of the attribute to query.
 * @return {!webdriver.promise.Promise.<?string>} A promise that will be
 *     resolved with the attribute's value. The returned value will always be
 *     either a string or null.
 */
webdriver.WebElement.prototype.getAttribute = function(attributeName) {};


/**
 * Get the visible (i.e. not hidden by CSS) innerText of this element, including
 * sub-elements, without any leading or trailing whitespace.
 *
 * @view
 * <div id="foo" class="bar">Inner text</div>
 *
 * @example
 * var foo = element(by.id('foo'));
 * expect(foo.getText()).toEqual('Inner text');
 *
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
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
 * @return {!webdriver.promise.Promise.<{width: number, height: number}>} A
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
 * @return {!webdriver.promise.Promise.<{x: number, y: number}>} A promise that
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
 * @return {!webdriver.promise.Promise.<boolean>} A promise that will be
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
 * @return {!webdriver.promise.Promise.<boolean>} A promise that will be
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
 * @return {!webdriver.promise.Promise.<void>} A promise that will be resolved
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
 * @return {!webdriver.promise.Promise.<void>} A promise that will be resolved
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
 * @return {!webdriver.promise.Promise.<boolean>} A promise that will be
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
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved to the screenshot as a base-64 encoded PNG.
 */
webdriver.WebElement.prototype.takeScreenshot = function(opt_scroll) {};


/**
 * Schedules a command to retrieve the outer HTML of this element.
 *
 * @view
 * <div id="parent">
 *   <div id="child">Text</div>
 * </div>
 *
 * @example
 * var child = element(by.id('child'));
 * expect(child.getOuterHtml()).toContain(
 *     '&lt;div id="child"&gt;Text&lt;/div&gt;');
 *
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved with the element's outer HTML.
 */
webdriver.WebElement.prototype.getOuterHtml = function() {};


/**
 * Schedules a command to retrieve the inner HTML of this element.
 *
 * @view
 * <div id="parent">
 *   <div id="child">Text</div>
 * </div>
 *
 * @example
 * var parent = element(by.id('parent'));
 * expect(parent.getInnerHtml()).toContain(
 *     '&lt;div id="child"&gt;Text&lt;/div&gt;');
 *
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved with the element's inner HTML.
 */
webdriver.WebElement.prototype.getInnerHtml = function() {};
