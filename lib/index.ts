import {ActionSequence, Browser, Builder, Button, Capabilities, Capability, error, EventEmitter, FileDetector, Key, logging, promise, Session, until, WebDriver, WebElement, WebElementPromise} from 'selenium-webdriver';

import {ElementHelper, ProtractorBrowser} from './browser';
import {ElementArrayFinder, ElementFinder} from './element';
import {ProtractorExpectedConditions} from './expectedConditions';
import {ProtractorBy} from './locators';
import {Ptor} from './ptor';

// Re-export selenium-webdriver types.
export {ActionSequence, Browser, Builder, Button, Capabilities, Capability, error, EventEmitter, FileDetector, Key, logging, promise, Session, until, WebDriver, WebElement, WebElementPromise} from 'selenium-webdriver';

// Re-export public types.
export {ElementHelper, ProtractorBrowser} from './browser';
export {Config} from './config';
export {ElementArrayFinder, ElementFinder} from './element';
export {ProtractorExpectedConditions} from './expectedConditions';
export {ProtractorBy} from './locators';
export {Ptor} from './ptor';

export let wrapDriver = ProtractorBrowser.wrapDriver;

export let utils = {
  firefox: require('selenium-webdriver/firefox'),
  http: require('selenium-webdriver/http'),
  remote: require('selenium-webdriver/remote')
}

export let Command = require('selenium-webdriver/lib/command').Command;
export let CommandName = require('selenium-webdriver/lib/command').Name;

// Export API instances based on the global Protractor object.
// We base this on NodeJS `global` because we do not want to mask
// with a different instance of Protractor if the module is
// installed both globally and locally.
export let protractor: Ptor = (global as any)['protractor'];
export let browser: ProtractorBrowser = protractor ? protractor.browser : undefined;
export let $: (search: string) => ElementFinder = protractor ? protractor.$ : undefined;
export let $$: (search: string) => ElementArrayFinder = protractor ? protractor.$$ : undefined;
export let element: ElementHelper = protractor ? protractor.element : undefined;
export let By: ProtractorBy = protractor ? protractor.By : undefined;
export let by: ProtractorBy = protractor ? protractor.by : undefined;
export let ExpectedConditions: ProtractorExpectedConditions =
    protractor ? protractor.ExpectedConditions : undefined;
