import {ElementHelper, ProtractorBrowser} from './browser';
import {ElementArrayFinder, ElementFinder} from './element';
import {ProtractorExpectedConditions} from './expectedConditions';
import {ProtractorBy} from './locators';

let webdriver = require('selenium-webdriver');

export namespace protractor {
  // Variables tied to the global namespace.
  export let browser: ProtractorBrowser;
  export let $ = function(search: string): ElementFinder { return null;};
  export let $$ = function(search: string): ElementArrayFinder { return null;};
  export let element: ElementHelper;
  export let By: ProtractorBy;
  export let by: ProtractorBy;
  export let wrapDriver:
      (webdriver: webdriver.WebDriver, baseUrl?: string, rootElement?: string,
       untrackOutstandingTimeouts?: boolean) => ProtractorBrowser;
  export let ExpectedConditions: ProtractorExpectedConditions;

  // Export protractor classes.
  export let ProtractorBrowser = require('./browser').ProtractorBrowser;
  export let ElementFinder = require('./element').ElementFinder;
  export let ElementArrayFinder = require('./element').ElementArrayFinder;
  export let ProtractorBy = require('./locators').ProtractorBy;
  export let ProtractorExpectedConditions =
      require('./expectedConditions').ProtractorExpectedConditions;

  // Export selenium webdriver.
  export let ActionSequence = webdriver.ActionSequence;
  export let Browser = webdriver.Browser;
  export let Builder = webdriver.Builder;
  export let Button = webdriver.Button;
  export let Capabilities = webdriver.Capabilities;
  export let Capability = webdriver.Capability;
  export let EventEmitter = webdriver.EventEmitter;
  export let FileDetector = webdriver.FileDetector;
  export let Key = webdriver.Key;
  export let Session = webdriver.Session;
  export let WebDriver = webdriver.WebDriver;
  export let WebElement = webdriver.WebElement;
  export let WebElementPromise = webdriver.WebElementPromise;
  export let error = webdriver.error;
  export let logging = webdriver.logging;
  export let promise = webdriver.promise;
  export let util = webdriver.util;
  export let Command = require('selenium-webdriver/lib/command').Command;
  export let CommandName = require('selenium-webdriver/lib/command').Name;
}
