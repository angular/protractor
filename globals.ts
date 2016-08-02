import {
  ProtractorBrowser,
  ElementArrayFinder,
  ElementFinder,
  ElementHelper,
  ProtractorBy,
  ProtractorExpectedConditions,
  Ptor
} from 'protractor';

export let protractor: Ptor = global['protractor'];
export let browser: ProtractorBrowser = global['protractor']['browser'];
export let $: (search: string) => ElementFinder = global['protractor']['$'];
export let $$: (search: string) => ElementArrayFinder = global['protractor']['$$'];
export let element: ElementHelper = global['protractor']['element'];
export let By: ProtractorBy = global['protractor']['By'];
export let by: ProtractorBy = global['protractor']['by'];
export let wrapDriver:
    (webdriver: any, baseUrl?: string, rootElement?: string,
     untrackOutstandingTimeouts?: boolean) => ProtractorBrowser = global['protractor']['wrapDriver'];
export let ExpectedConditions: ProtractorExpectedConditions = global['protractor']['ExpectedConditions'];
