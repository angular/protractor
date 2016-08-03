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
export let browser: ProtractorBrowser = protractor.browser;
export let $: (search: string) => ElementFinder = protractor.$;
export let $$: (search: string) => ElementArrayFinder = protractor.$$;
export let element: ElementHelper = protractor.element;
export let By: ProtractorBy = protractor.By;
export let by: ProtractorBy = protractor.by;
export let wrapDriver:
    (webdriver: any, baseUrl?: string, rootElement?: string,
     untrackOutstandingTimeouts?: boolean) => ProtractorBrowser = protractor.wrapDriver;
export let ExpectedConditions: ProtractorExpectedConditions = protractor.ExpectedConditions;
