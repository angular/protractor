// Used to provide better protractor documentation for webdriver. These files
// are not used to provide code for protractor and are only used for the website.

/**
 * @fileoverview Factory methods for the supported locator strategies.
 */

goog.provide('webdriver.By');
goog.provide('webdriver.Locator');
goog.provide('webdriver.Locator.Strategy');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.string');


/**
 * A collection of factory functions for creating {@link webdriver.Locator}
 * instances.
 */
webdriver.By = {};
// Exported to the global scope for legacy reasons.
goog.exportSymbol('By', webdriver.By);


/**
 * Locates elements that have a specific class name. The returned locator
 * is equivalent to searching for elements with the CSS selector ".clazz".
 *
 * @param {string} className The class name to search for.
 * @return {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/2011/WD-html5-20110525/elements.html#classes
 * @see http://www.w3.org/TR/CSS2/selector.html#class-html
 */
webdriver.By.className = webdriver.Locator.factory_('class name');


/**
 * Locates elements using a CSS selector. For browsers that do not support
 * CSS selectors, WebDriver implementations may return an
 * {@linkplain bot.Error.State.INVALID_SELECTOR invalid selector} error. An
 * implementation may, however, emulate the CSS selector API.
 *
 * @param {string} selector The CSS selector to use.
 * @return {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/CSS2/selector.html
 */
webdriver.By.css = webdriver.Locator.factory_('css selector');


/**
 * Locates an element by its ID.
 *
 * @param {string} id The ID to search for.
 * @return {!webdriver.Locator} The new locator.
 */
webdriver.By.id = webdriver.Locator.factory_('id');


/**
 * Locates link elements whose {@linkplain webdriver.WebElement#getText visible
 * text} matches the given string.
 *
 * @view
 * <a href="http://www.google.com">Google</a>
 *
 * @example
 * expect(element(by.linkText('Google')).getTagName()).toBe('a');
 *
 * @param {string} text The link text to search for.
 * @return {!webdriver.Locator} The new locator.
 */
webdriver.By.linkText = webdriver.Locator.factory_('link text');


/**
 * Locates an elements by evaluating a
 * {@linkplain webdriver.WebDriver#executeScript JavaScript expression}.
 * The result of this expression must be an element or list of elements.
 *
 * @param {!(string|Function)} script The script to execute.
 * @param {...*} var_args The arguments to pass to the script.
 * @return {function(!webdriver.WebDriver): !webdriver.promise.Promise} A new,
 *     JavaScript-based locator function.
 */
webdriver.By.js = function(script, var_args) {};


/**
 * Locates elements whose {@code name} attribute has the given value.
 *
 * @param {string} name The name attribute to search for.
 * @return {!webdriver.Locator} The new locator.
 */
webdriver.By.name = webdriver.Locator.factory_('name');

/**
 * Locates elements with a given tag name. The returned locator is
 * equivalent to using the
 * [getElementsByTagName](https://developer.mozilla.org/en-US/docs/Web/API/Element.getElementsByTagName)
 * DOM function.
 *
 * @view
 * <a href="http://www.google.com">Google</a>
 *
 * @example
 * expect(element(by.tagName('a')).getText()).toBe('Google');
 *
 * @param {string} text The substring to check for in a link's visible text.
 * @return {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html
 */
webdriver.By.tagName = webdriver.Locator.factory_('tag name');


/**
 * Locates elements matching a XPath selector. Care should be taken when
 * using an XPath selector with a {@link webdriver.WebElement} as WebDriver
 * will respect the context in the specified in the selector. For example,
 * given the selector {@code "//div"}, WebDriver will search from the
 * document root regardless of whether the locator was used with a
 * WebElement.
 *
 * @param {string} xpath The XPath selector to use.
 * @return {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/xpath/
 */
webdriver.By.xpath = webdriver.Locator.factory_('xpath');
