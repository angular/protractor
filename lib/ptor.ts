import {ProtractorBrowser, ElementHelper} from './browser';
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
  export let promise = webdriver.promise;
  export let WebElement = webdriver.WebElement;
  export let ActionSequence = webdriver.ActionSequence;
  export let Key = webdriver.Key;
  export let Command = require('selenium-webdriver/lib/command').Command;
  export let CommandName = require('selenium-webdriver/lib/command').Name;
}
