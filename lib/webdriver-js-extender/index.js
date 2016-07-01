// Used to provide better protractor documentation for methods given by
// `webdriver-js-extender`.

/**
 * @fileoverview Extra methods provided by webdriver-js-extender.
 */

goog.provide('webdriver_extensions');

// /////////////////////////////////////////////////////////////////////////////
// //
// //  webdriver_extensions.ExtendedWebDriver
// //
// /////////////////////////////////////////////////////////////////////////////
/**
 * Protractor's `browser` object is a wrapper for an instance of
 * `ExtendedWebDriver`, provided by `webdriver-js-extender`, which itself is
 * just an instance of `selenium-webdriver`'s WebDriver with some extra methods
 * added in. The `browser` object inherits all of WebDriver's and
 * ExtendedWebDriver's methods, but only the methods most useful to Protractor
 * users are documented here.
 *
 * More information about `webdriver-js-extender` can be found on the [GitHub
 * repo](https://github.com/angular/webdriver-js-extender).
 * @alias ExtendedWebDriver
 * @constructor
 * @extends {webdriver.WebDriver}
 */
webdriver_extensions.ExtendedWebDriver = function() {};

/**
 * Schedules a command to retrieve the network connection type.
 *
 * Network connection types are a bitmask with:
 *    1 -> airplane mode
 *    2 -> wifi
 *    4 -> data
 *
 * @example
 * expect(browser.getNetworkConnection()).toBe(6); //Expect wifi and data on
 *
 * @returns {!webdriver.promise.Promise.<number>} A promise that will be
 *     resolved with the current network connection type.
 */
webdriver_extensions.ExtendedWebDriver.prototype.getNetworkConnection = function() {};

/**
 * Schedules a command to set the network connection type.
 *
 * Network connection types are a bitmask with:
 *    1 -> airplane mode
 *    2 -> wifi
 *    4 -> data
 *
 * @example
 * browser.setNetworkConnection(1); //Turn on airplane mode
 * expect(browser.getNetworkConnection()).toBe(1);
 *
 * @param {number} type The type to set the network connection to.
 * @returns {!webdriver.promise.Promise.<void>} A promise that will be
 *     resolved when the network connection type is set.
 */
webdriver_extensions.ExtendedWebDriver.prototype.setNetworkConnection = function(type) {};
