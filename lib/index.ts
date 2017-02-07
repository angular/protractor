import {ElementHelper, ProtractorBrowser} from './browser';
import {ElementArrayFinder, ElementFinder} from './element';
import {ProtractorExpectedConditions} from './expectedConditions';
import {ProtractorBy} from './locators';
import {PluginConfig, ProtractorPlugin} from './plugins';
import {Ptor} from './ptor';
import {Runner} from './runner';

// Re-export selenium-webdriver types.
export {ActionSequence, Browser, Builder, Button, Capabilities, Capability, error, EventEmitter, FileDetector, Key, logging, promise, Session, until, WebDriver, WebElement, WebElementPromise} from 'selenium-webdriver';
// Re-export public types.
export {ElementHelper, ProtractorBrowser} from './browser';
export {Config} from './config';
export {ElementArrayFinder, ElementFinder} from './element';
export {ProtractorExpectedConditions} from './expectedConditions';
export {ProtractorBy} from './locators';
export {Ptor} from './ptor';

export type Runner = Runner;
export type PluginConfig = PluginConfig;
export type ProtractorPlugin = ProtractorPlugin;

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

function registerGlobal(name: string) {
  Object.defineProperty(
      exports, name, {get: () => exports.protractor ? exports.protractor[name] : undefined});
}

export declare let browser: ProtractorBrowser;
export declare let $: (search: string) => ElementFinder;
export declare let $$: (search: string) => ElementArrayFinder;
export declare let element: ElementHelper;
export declare let By: ProtractorBy;
export declare let by: ProtractorBy;
export declare let ExpectedConditions: ProtractorExpectedConditions;

registerGlobal('browser');
registerGlobal('$');
registerGlobal('$$');
registerGlobal('element');
registerGlobal('By');
registerGlobal('by');
registerGlobal('ExpectedConditions');
