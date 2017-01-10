"use strict";
// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor/globals'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor/globals';
//
const protractor_1 = require('protractor');
class AngularHomepage {
    constructor() {
        this.nameInput = protractor_1.element(protractor_1.by.model('yourName'));
        this.greeting = protractor_1.element(protractor_1.by.binding('yourName'));
    }
    get() {
        protractor_1.browser.get('http://www.angularjs.org');
    }
    setName(name) {
        this.nameInput.sendKeys(name);
    }
    // getGreeting returns a webdriver.promise.Promise.<string>. For simplicity
    // setting the return value to any
    getGreeting() {
        return this.greeting.getText();
    }
}
exports.AngularHomepage = AngularHomepage;
