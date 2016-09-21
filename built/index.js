"use strict";
var browser_1 = require('./browser');
// Re-export selenium-webdriver types.
var selenium_webdriver_1 = require('selenium-webdriver');
exports.ActionSequence = selenium_webdriver_1.ActionSequence;
exports.Browser = selenium_webdriver_1.Browser;
exports.Builder = selenium_webdriver_1.Builder;
exports.Button = selenium_webdriver_1.Button;
exports.Capabilities = selenium_webdriver_1.Capabilities;
exports.Capability = selenium_webdriver_1.Capability;
exports.error = selenium_webdriver_1.error;
exports.EventEmitter = selenium_webdriver_1.EventEmitter;
exports.FileDetector = selenium_webdriver_1.FileDetector;
exports.Key = selenium_webdriver_1.Key;
exports.logging = selenium_webdriver_1.logging;
exports.promise = selenium_webdriver_1.promise;
exports.Session = selenium_webdriver_1.Session;
exports.until = selenium_webdriver_1.until;
exports.WebDriver = selenium_webdriver_1.WebDriver;
exports.WebElement = selenium_webdriver_1.WebElement;
exports.WebElementPromise = selenium_webdriver_1.WebElementPromise;
// Re-export public types.
var browser_2 = require('./browser');
exports.ProtractorBrowser = browser_2.ProtractorBrowser;
var element_1 = require('./element');
exports.ElementArrayFinder = element_1.ElementArrayFinder;
exports.ElementFinder = element_1.ElementFinder;
var expectedConditions_1 = require('./expectedConditions');
exports.ProtractorExpectedConditions = expectedConditions_1.ProtractorExpectedConditions;
var locators_1 = require('./locators');
exports.ProtractorBy = locators_1.ProtractorBy;
var ptor_1 = require('./ptor');
exports.Ptor = ptor_1.Ptor;
exports.wrapDriver = browser_1.ProtractorBrowser.wrapDriver;
exports.utils = {
    firefox: require('selenium-webdriver/firefox'),
    http: require('selenium-webdriver/http'),
    remote: require('selenium-webdriver/remote')
};
exports.Command = require('selenium-webdriver/lib/command').Command;
exports.CommandName = require('selenium-webdriver/lib/command').Name;
// Export API instances based on the global Protractor object.
// We base this on NodeJS `global` because we do not want to mask
// with a different instance of Protractor if the module is
// installed both globally and locally.
exports.protractor = global['protractor'];
exports.browser = exports.protractor ? exports.protractor.browser : undefined;
exports.$ = exports.protractor ? exports.protractor.$ : undefined;
exports.$$ = exports.protractor ? exports.protractor.$$ : undefined;
exports.element = exports.protractor ? exports.protractor.element : undefined;
exports.By = exports.protractor ? exports.protractor.By : undefined;
exports.by = exports.protractor ? exports.protractor.by : undefined;
exports.ExpectedConditions = exports.protractor ? exports.protractor.ExpectedConditions : undefined;
