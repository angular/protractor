// Used to provide better protractor documentation for webdriver. These files
// are not used to provide code for protractor and are only used for the website.

/**
 * @fileoverview Factory methods for the supported locator strategies.
 */

goog.provide('webdriver');

/**
 * A collection of factory functions for creating {@link webdriver.Locator}
 * instances.
 */
webdriver.By = {};

/**
 * Locates elements that have a specific class name. The returned locator
 * is equivalent to searching for elements with the CSS selector ".clazz".
 *
 * @view
 * <ul class="pet">
 *   <li class="dog">Dog</li>
 *   <li class="cat">Cat</li>
 * </ul>
 *
 * @example
 * // Returns the web element for dog
 * var dog = element(by.className('dog'));
 * expect(dog.getText()).toBe('Dog');
 *
 * @param {string} className The class name to search for.
 * @returns {!webdriver.Locator} The new locator.
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
 * @view
 * <ul class="pet">
 *   <li class="dog">Dog</li>
 *   <li class="cat">Cat</li>
 * </ul>
 *
 * @example
 * // Returns the web element for cat
 * var cat = element(by.css('.pet .cat'));
 * expect(cat.getText()).toBe('Cat');
 *
 * @param {string} selector The CSS selector to use.
 * @returns {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/CSS2/selector.html
 */
webdriver.By.css = webdriver.Locator.factory_('css selector');


/**
 * Locates an element by its ID.
 *
 * @view
 * <ul id="pet_id">
 *   <li id="dog_id">Dog</li>
 *   <li id="cat_id">Cat</li>
 * </ul>
 *
 * @example
 * // Returns the web element for dog
 * var dog = element(by.id('dog_id'));
 * expect(dog.getText()).toBe('Dog');
 *
 * @param {string} id The ID to search for.
 * @returns {!webdriver.Locator} The new locator.
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
 * @returns {!webdriver.Locator} The new locator.
 */
webdriver.By.linkText = webdriver.Locator.factory_('link text');


/**
 * Locates an elements by evaluating a JavaScript expression, which may
 * be either a function or a string. Like
 * {@link webdriver.WebDriver.executeScript}, the expression is evaluated
 * in the context of the page and cannot access variables from
 * the test file.
 *
 * The result of this expression must be an element or list of elements.
 *
 * @alias by.js(expression)
 * @view
 * <span class="small">One</span>
 * <span class="medium">Two</span>
 * <span class="large">Three</span>
 *
 * @example
 * var wideElement = element(by.js(function() {
 *   var spans = document.querySelectorAll('span');
 *   for (var i = 0; i < spans.length; ++i) {
 *     if (spans[i].offsetWidth > 100) {
 *      return spans[i];
 *     }
 *   }
 * }));
 * expect(wideElement.getText()).toEqual('Three');
 *
 * @param {!(string|Function)} script The script to execute.
 * @param {...*} var_args The arguments to pass to the script.
 * @returns {!webdriver.Locator}
 */
webdriver.By.js = function(script, var_args) {};


/**
 * Locates elements whose {@code name} attribute has the given value.
 *
 * @view
 * <ul>
 *   <li name="dog_name">Dog</li>
 *   <li name="cat_name">Cat</li>
 * </ul>
 *
 * @example
 * // Returns the web element for dog
 * var dog = element(by.name('dog_name'));
 * expect(dog.getText()).toBe('Dog');
 *
 * @param {string} name The name attribute to search for.
 * @returns {!webdriver.Locator} The new locator.
 */
webdriver.By.name = webdriver.Locator.factory_('name');


/**
 * Locates link elements whose {@linkplain webdriver.WebElement#getText visible
 * text} contains the given substring.
 *
 * @view
 * <ul>
 *   <li><a href="https://en.wikipedia.org/wiki/Doge_(meme)">Doge meme</a></li>
 *   <li>Cat</li>
 * </ul>
 *
 * @example
 * // Returns the 'a' web element for doge meme and navigate to that link
 * var doge = element(by.partialLinkText('Doge'));
 * doge.click();
 *
 * @param {string} text The substring to check for in a link's visible text.
 * @returns {!webdriver.Locator} The new locator.
 */
webdriver.By.partialLinkText = webdriver.Locator.factory_(
    'partial link text');


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
 * @returns {!webdriver.Locator} The new locator.
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
 * @view
 * <ul>
 *   <li><a href="https://en.wikipedia.org/wiki/Doge_(meme)">Doge meme</a></li>
 *   <li>Cat</li>
 * </ul>
 *
 * @example
 * // Returns the 'a' element for doge meme
 * var li = element(by.xpath('//ul/li/a'));
 * expect(li.getText()).toBe('Doge meme');
 *
 * @param {string} xpath The XPath selector to use.
 * @returns {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/xpath/
 */
webdriver.By.xpath = webdriver.Locator.factory_('xpath');
