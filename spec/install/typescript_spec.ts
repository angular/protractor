import {browser, by, By, element, $, $$, ExpectedConditions, protractor} from 'protractor';

describe('typescript imports', () => {
  it('should have global objects that match the protractor namespace', () => {
    expect(protractor.browser === browser).toBeTruthy();
    expect(protractor.by === by).toBeTruthy();
    expect(protractor.By === By).toBeTruthy();
    expect(protractor.$ === $).toBeTruthy();
    expect(protractor.$$ === $$).toBeTruthy();
    expect(protractor.ExpectedConditions === ExpectedConditions).toBeTruthy();
  });
  it('should have selenium-webdriver components for the protractor namespace', () => {
    // expect(typeof protractor.promise.all).toEqual('function');
    // expect(typeof protractor.promise.defer).toEqual('function');
    // expect(typeof protractor.promise.Promise).toEqual('function');
    // expect(typeof protractor.ActionSequence).toEqual('function');
    expect(typeof protractor.Browser).toEqual('object');
    expect(typeof protractor.Builder).toEqual('function');
    expect(typeof protractor.Capabilities).toEqual('function');
    expect(typeof protractor.Capability).toEqual('object');
    // expect(typeof protractor.EventEmitter).toEqual('function');
    expect(typeof protractor.FileDetector).toEqual('function');
    expect(typeof protractor.Key).toEqual('object');
    expect(typeof protractor.Session).toEqual('function');
    expect(typeof protractor.WebDriver).toEqual('function');
    expect(typeof protractor.WebElement).toEqual('function');
    expect(typeof protractor.WebElementPromise).toEqual('function');
    expect(typeof protractor.error).toEqual('object');
    expect(typeof protractor.logging).toEqual('object');
    expect(typeof protractor.promise).toEqual('object');
    expect(typeof protractor.until).toEqual('object');
    expect(typeof protractor.Command).toEqual('function');
    expect(typeof protractor.CommandName).toEqual('object');
    expect(typeof protractor.utils.firefox).toEqual('object');
    expect(typeof protractor.utils.http).toEqual('object');
    expect(typeof protractor.utils.remote).toEqual('object');
  });
  it('should have protractor class definitions', () => {
    expect(typeof protractor.ProtractorBrowser).toBe('function');
    expect(typeof protractor.ElementFinder).toBe('function');
    expect(typeof protractor.ElementArrayFinder).toBe('function');
    expect(typeof protractor.ProtractorBy).toBe('function');
    expect(typeof protractor.ProtractorExpectedConditions).toBe('function');
  });
});
