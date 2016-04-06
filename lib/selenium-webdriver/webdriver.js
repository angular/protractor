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
// //  webdriver.WebElement
// //
// //////////////////////////////////////////////////////////////////////////////
//
//
//
/**
 * Represents a DOM element. WebElements can be found by searching from the
 * document root using a {@link Protractor} browser instance, or by searching
 * under another WebElement:
 *
 *     browser.get('http://www.google.com');
 *     var searchForm = browser.findElement(By.tagName('form'));
 *     var searchBox = searchForm.findElement(By.name('q'));
 *     searchBox.sendKeys('webdriver');
 *
 * The WebElement is implemented as a promise for compatibility with the promise
 * API. It will always resolve itself when its internal state has been fully
 * resolved and commands may be issued against the element. This can be used to
 * catch errors when an element cannot be located on the page:
 *
 *     browser.findElement(By.id('not-there')).then(function(element) {
 *       alert('Found an element that was not expected to be there!');
 *     }, function(error) {
 *       alert('The element was not found, as expected');
 *     });
 *
 * @param {!webdriver.WebDriver} driver The webdriver driver or the parent WebDriver instance for this
 *     element.
 * @param {!(webdriver.promise.Promise.<webdriver.WebElement.Id>|
 *           webdriver.WebElement.Id)} id The server-assigned opaque ID for the
 *     underlying DOM element.
 * @constructor
 * @extends {webdriver.Serializable.<webdriver.WebElement.Id>}
 */
webdriver.WebElement = function(driver, id) {};
goog.inherits(webdriver.WebElement, webdriver.Serializable);

/**
 * Compares to WebElements for equality.
 * @param {!webdriver.WebElement} a A WebElement.
 * @param {!webdriver.WebElement} b A WebElement.
 * @return {!webdriver.promise.Promise.<boolean>} A promise that will be
 *     resolved to whether the two WebElements are equal.
 */
webdriver.WebElement.equals = function(a, b) {};


/**
 * @return {!webdriver.WebDriver} The parent driver for this instance.
 */
webdriver.WebElement.prototype.getDriver = function() {};


/**
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
 * @package
 */
webdriver.WebElement.prototype.getRawId = function() {};


/** @override */
webdriver.WebElement.prototype.serialize = function() {};

/**
 * Schedule a command to find a descendant of this element. If the element
 * cannot be found, a {@link bot.ErrorCode.NO_SUCH_ELEMENT} result will
 * be returned by the driver. Unlike other commands, this error cannot be
 * suppressed. In other words, scheduling a command to find an element doubles
 * as an assert that the element is present on the page. To test whether an
 * element is present on the page, use {@link #isElementPresent} instead.
 *
 * The search criteria for an element may be defined using one of the
 * factories in the {@link webdriver.By} namespace, or as a short-hand
 * {@link webdriver.By.Hash} object. For example, the following two statements
 * are equivalent:
 *
 *     var e1 = element.findElement(By.id('foo'));
 *     var e2 = element.findElement({id:'foo'});
 *
 * You may also provide a custom locator function, which takes as input
 * this WebDriver instance and returns a {@link webdriver.WebElement}, or a
 * promise that will resolve to a WebElement. For example, to find the first
 * visible link on a page, you could write:
 *
 *     var link = element.findElement(firstVisibleLink);
 *
 *     function firstVisibleLink(element) {
 *       var links = element.findElements(By.tagName('a'));
 *       return webdriver.promise.filter(links, function(link) {
 *         return links.isDisplayed();
 *       }).then(function(visibleLinks) {
 *         return visibleLinks[0];
 *       });
 *     }
 *
 * @param {!(webdriver.Locator|webdriver.By.Hash|Function)} locator The
 *     locator strategy to use when searching for the element.
 * @return {!webdriver.WebElement} A WebElement that can be used to issue
 *     commands against the located element. If the element is not found, the
 *     element will be invalidated and all scheduled commands aborted.
 */
webdriver.WebElement.prototype.findElement = function(locator) {};


/**
 * Schedules a command to test if there is at least one descendant of this
 * element that matches the given search criteria.
 *
 * @param {!(webdriver.Locator|webdriver.By.Hash|Function)} locator The
 *     locator strategy to use when searching for the element.
 * @return {!webdriver.promise.Promise.<boolean>} A promise that will be
 *     resolved with whether an element could be located on the page.
 */
webdriver.WebElement.prototype.isElementPresent = function(locator) {};


/**
 * Schedules a command to find all of the descendants of this element that
 * match the given search criteria.
 *
 * @param {!(webdriver.Locator|webdriver.By.Hash|Function)} locator The
 *     locator strategy to use when searching for the elements.
 * @return {!webdriver.promise.Promise.<!Array.<!webdriver.WebElement>>} A
 *     promise that will resolve to an array of WebElements.
 */
webdriver.WebElement.prototype.findElements = function(locator) {};


/**
 * Schedules a command to click on this element.
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
 *                          webdriver.Key.CONTROL, "a", webdriver.Key.NULL,
 *                          "now text is");
 *         // Alternatively:
 *         element.sendKeys("text was",
 *                          webdriver.Key.chord(webdriver.Key.CONTROL, "a"),
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
 * Schedules a command to query for the tag/node name of this element.
 * @return {!webdriver.promise.Promise.<string>} A promise that will be
 *     resolved with the element's tag name.
 */
webdriver.WebElement.prototype.getTagName = function() {};


/**
 * Schedules a command to query for the computed style of the element
 * represented by this instance. If the element inherits the named style from
 * its parent, the parent will be queried for its value.  Where possible, color
 * values will be converted to their hex representation (e.g. #00ff00 instead of
 * rgb(0, 255, 0)).
 *
 * _Warning:_ the value returned will be as the browser interprets it, so
 * it may be tricky to form a proper assertion.
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
