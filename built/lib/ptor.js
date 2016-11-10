"use strict";
var webdriver = require('selenium-webdriver');
var protractor;
(function (protractor) {
    protractor.$ = function (search) {
        return null;
    };
    protractor.$$ = function (search) {
        return null;
    };
    // Export protractor classes.
    protractor.Browser = require('./browser').Browser;
    protractor.ElementFinder = require('./element').ElementFinder;
    protractor.ElementArrayFinder = require('./element').ElementArrayFinder;
    protractor.ProtractorBy = require('./locators').ProtractorBy;
    protractor.ProtractorExpectedConditions = require('./expectedConditions').ProtractorExpectedConditions;
    // Export selenium webdriver.
    protractor.promise = webdriver.promise;
    protractor.WebElement = webdriver.WebElement;
    protractor.ActionSequence = webdriver.ActionSequence;
    protractor.Key = webdriver.Key;
    protractor.Command = require('selenium-webdriver/lib/command').Command;
    protractor.CommandName = require('selenium-webdriver/lib/command').Name;
})(protractor = exports.protractor || (exports.protractor = {}));
