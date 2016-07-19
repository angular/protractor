import {Browser, ElementHelper} from './browser';
import {ElementArrayFinder, ElementFinder} from './element';
import {ProtractorExpectedConditions} from './expectedConditions';
import {ProtractorBy} from './locators';

let webdriver = require('selenium-webdriver');

export namespace protractor {
  export let browser: Browser;
  export let $ = function(search: string): ElementFinder { return null;};
  export let $$ = function(search: string): ElementArrayFinder { return null;};
  export let element: ElementHelper;
  export let By: ProtractorBy;
  export let by: ProtractorBy;
  export let wrapDriver: Function;
  export let ExpectedConditions: ProtractorExpectedConditions;

  // Export the protractor classes
  export let Browser = require('./browser').Browser;
  export let ElementFinder = require('./element').ElementFinder;
  export let ElementArrayFinder = require('./element').ElementArrayFinder;
  export let ElementHelper = require('./browser').ElementHelper;
  export let ProtractorBy = require('./locators').ProtractorBy;
  export let ProtractorExpectedConditions =
      require('./expectedConditions').ProtractorExpectedConditions;

  // Define selenium webdriver imports.
  export let promise = webdriver.promise;
  export let WebElement = webdriver.WebElement;
  export let ActionSequence = webdriver.ActionSequence;
  export let Key = webdriver.Key;
  export let Command = require('selenium-webdriver/lib/command').Command;
  export let CommandName = require('selenium-webdriver/lib/command').Name;
}
