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
};

export let Command = require('selenium-webdriver/lib/command').Command;
export let CommandName = require('selenium-webdriver/lib/command').Name;

// Export API instances based on the global Protractor object.
// We base this on NodeJS `global` because we do not want to mask
// with a different instance of Protractor if the module is
// installed both globally and locally.

// Because these properties are set dynamically by the runner in setupGlobals_, they are not
// guaranteed to be created at import time. Also, the browser object can change if browser.reset()
// is called. Thus, we export these as properties so they will be resolved dynamically.
export declare let protractor: Ptor;
Object.defineProperty(exports, 'protractor', {get: () => (global as any)['protractor']});

export declare let browser: ProtractorBrowser;
Object.defineProperty(exports, 'browser', {get: () => exports.protractor.browser});

export declare let $: (search: string) => ElementFinder;
Object.defineProperty(exports, '$', {get: () => exports.protractor.$});

export declare let $$: (search: string) => ElementArrayFinder;
Object.defineProperty(exports, '$$', {get: () => exports.protractor.$$});

export declare let element: ElementHelper;
Object.defineProperty(exports, 'element', {get: () => exports.protractor.element});

export declare let By: ProtractorBy;
Object.defineProperty(exports, 'By', {get: () => exports.protractor.By});

export declare let by: ProtractorBy;
Object.defineProperty(exports, 'by', {get: () => exports.protractor.by});

export declare let ExpectedConditions: ProtractorExpectedConditions;
Object.defineProperty(
    exports, 'ExpectedConditions', {get: () => exports.protractor.ExpectedConditions});
