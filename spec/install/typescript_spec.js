"use strict";
var globals_1 = require('protractor/globals');
describe('typescript imports', function () {
    it('should have global objects that match the protractor namespace', function () {
        expect(globals_1.protractor.browser === globals_1.browser).toBeTruthy();
        expect(globals_1.protractor.by === globals_1.by).toBeTruthy();
        expect(globals_1.protractor.By === globals_1.By).toBeTruthy();
        expect(globals_1.protractor.$ === globals_1.$).toBeTruthy();
        expect(globals_1.protractor.$$ === globals_1.$$).toBeTruthy();
        expect(globals_1.protractor.ExpectedConditions === globals_1.ExpectedConditions).toBeTruthy();
        expect(typeof globals_1.protractor.wrapDriver).toEqual('function');
    });
    it('should have selenium-webdriver components for the protractor namespace', function () {
        expect(typeof globals_1.protractor.promise.all).toEqual('function');
        expect(typeof globals_1.protractor.promise.defer).toEqual('function');
        expect(typeof globals_1.protractor.promise.Promise).toEqual('function');
        expect(typeof globals_1.protractor.ActionSequence).toEqual('function');
        expect(typeof globals_1.protractor.Browser).toEqual('object');
        expect(typeof globals_1.protractor.Builder).toEqual('function');
        expect(typeof globals_1.protractor.Capabilities).toEqual('function');
        expect(typeof globals_1.protractor.Capability).toEqual('object');
        expect(typeof globals_1.protractor.EventEmitter).toEqual('function');
        expect(typeof globals_1.protractor.FileDetector).toEqual('function');
        expect(typeof globals_1.protractor.Key).toEqual('object');
        expect(typeof globals_1.protractor.Session).toEqual('function');
        expect(typeof globals_1.protractor.WebDriver).toEqual('function');
        expect(typeof globals_1.protractor.WebElement).toEqual('function');
        expect(typeof globals_1.protractor.WebElementPromise).toEqual('function');
        expect(typeof globals_1.protractor.error).toEqual('object');
        expect(typeof globals_1.protractor.logging).toEqual('object');
        expect(typeof globals_1.protractor.promise).toEqual('object');
        expect(typeof globals_1.protractor.until).toEqual('object');
        expect(typeof globals_1.protractor.Command).toEqual('function');
        expect(typeof globals_1.protractor.CommandName).toEqual('object');
        expect(typeof globals_1.protractor.utils.firefox).toEqual('object');
        expect(typeof globals_1.protractor.utils.http).toEqual('object');
        expect(typeof globals_1.protractor.utils.remote).toEqual('object');
    });
    it('should have protractor class definitions', function () {
        expect(typeof globals_1.protractor.ProtractorBrowser).toBe('function');
        expect(typeof globals_1.protractor.ElementFinder).toBe('function');
        expect(typeof globals_1.protractor.ElementArrayFinder).toBe('function');
        expect(typeof globals_1.protractor.ProtractorBy).toBe('function');
        expect(typeof globals_1.protractor.ProtractorExpectedConditions).toBe('function');
    });
});
