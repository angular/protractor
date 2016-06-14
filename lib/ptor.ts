import {Browser, ElementHelper} from './browser';
import {ProtractorBy} from './locators';
import {ElementFinder, ElementArrayFinder} from './element';
import * as EC from './expectedConditions';
import {Promise} from './selenium-webdriver/promise';

export namespace protractor {
  export let browser: Browser;
  export let $ = function(search: string): ElementFinder {
    return null;
  };
  export let $$ = function(search: string): ElementArrayFinder {
    return null;
  };
  export let element: ElementHelper;
  export let By: ProtractorBy;
  export let by: ProtractorBy;

  // TODO: Might need to fix imports
  export let wrapDriver: Function;
  export let ExpectedConditions = new EC.ExpectedConditions();
  export let promise = {
    controlFlow: require('selenium-webdriver/lib/promise').controlFlow,
    createFlow: require('selenium-webdriver/lib/promise').createFlow,
    defer: require('selenium-webdriver/lib/promise').defer,
    delayed: require('selenium-webdriver/lib/promise').delayed,
    filter: require('selenium-webdriver/lib/promise').filter,
    fulfilled: require('selenium-webdriver/lib/promise').fulfilled,
    fullyResolved: require('selenium-webdriver/lib/promise').fullyResolved,
    isPromise: require('selenium-webdriver/lib/promise').isPromise,
    rejected: require('selenium-webdriver/lib/promise').rejected,
    thenFinally: require('selenium-webdriver/lib/promise').thenFinally,
    when: require('selenium-webdriver/lib/promise').when
  };
  export let ActionSequence = require('selenium-webdriver/lib/actions').ActionSequence;
  export let Key = require('selenium-webdriver/lib/input').Key;

  export let Command = require('selenium-webdriver/lib/command').Command;
  export let CommandName = require('selenium-webdriver/lib/command').Name;
}
