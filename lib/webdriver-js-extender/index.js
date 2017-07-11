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
 * ***If you are not using an appium server, `browser` may sometimes inherit
 * directly from a normal `WebDriver` instance, and thus not inherit any of
 * the extra methods defined by `webdriver-js-extender`.  Even when `browser`
 * does inherit from `ExtendedWebDriver`, these extra methods will only work if
 * your server implements the Appium API.***
 *
 * More information about `webdriver-js-extender` can be found on the [GitHub
 * repo](https://github.com/angular/webdriver-js-extender).
 * @alias ExtendedWebDriver
 * @constructor
 * @extends {webdriver.WebDriver}
 */
webdriver_extensions.ExtendedWebDriver = function() {};

/**
 * Various appium commands, including the commands implemented by `wd`.  The
 * names may be different however, and commands which are implemented already by
 * `selenium-webdriver` are not re-implemented by `webdriver-js-extender`.
 *
 * See the [GitHub repo](https://github.com/angular/webdriver-js-extender) for
 * details. 
 *
 * @returns {!webdriver.promise.Promise.<*>}
 */
webdriver_extensions.ExtendedWebDriver.prototype.Appium_Commands = function() {};
