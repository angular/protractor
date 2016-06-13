import {Browser, ElementHelper} from './browser';
import {ProtractorBy} from './locators';
import {ElementFinder, ElementArrayFinder} from './element';
import * as EC from './expectedConditions';

let SeleniumWebdriverActions = require('selenium-webdriver/lib/actions');
let SeleniumWebdriverInput = require('selenium-webdriver/lib/input');
let SeleniumWebdriverPromise = require('selenium-webdriver/lib/promise');
let SeleniumWebdriverCommand = require('selenium-webdriver/lib/command');

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
    controlFlow: SeleniumWebdriverPromise.controlFlow,
    createFlow: SeleniumWebdriverPromise.createFlow,
    defer: SeleniumWebdriverPromise.defer,
    delayed: SeleniumWebdriverPromise.delayed,
    filter: SeleniumWebdriverPromise.filter,
    fulfilled: SeleniumWebdriverPromise.fulfilled,
    fullyResolved: SeleniumWebdriverPromise.fullyResolved,
    isPromise: SeleniumWebdriverPromise.isPromise,
    rejected: SeleniumWebdriverPromise.rejected,
    thenFinally: SeleniumWebdriverPromise.thenFinally,
    when: SeleniumWebdriverPromise.when
  };
  export let ActionSequence = SeleniumWebdriverActions.ActionSequence;
  export let Key = SeleniumWebdriverInput.Key;

  export let Command = SeleniumWebdriverCommand.Command;
  export let CommandName = SeleniumWebdriverCommand.Name;
}
