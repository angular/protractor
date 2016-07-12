"use strict";
var webdriver = require('selenium-webdriver');
var protractor;
(function (protractor) {
    protractor.$ = function (search) { return null; };
    protractor.$$ = function (search) { return null; };
    // Define selenium webdriver imports.
    protractor.promise = {
        controlFlow: webdriver.promise.controlFlow,
        createFlow: webdriver.promise.createFlow,
        defer: webdriver.promise.defer,
        delayed: webdriver.promise.delayed,
        filter: webdriver.promise.filter,
        fulfilled: webdriver.promise.fulfilled,
        fullyResolved: webdriver.promise.fullyResolved,
        isPromise: webdriver.promise.isPromise,
        rejected: webdriver.promise.rejected,
        thenFinally: webdriver.promise.thenFinally,
        when: webdriver.promise.when
    };
    protractor.ActionSequence = webdriver.ActionSequence;
    protractor.Key = webdriver.Key;
    protractor.Command = require('selenium-webdriver/lib/command').Command;
    protractor.CommandName = require('selenium-webdriver/lib/command').Name;
})(protractor = exports.protractor || (exports.protractor = {}));
