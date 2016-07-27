import {
  Browser,
  ElementArrayFinder,
  ElementFinder,
  ElementHelper,
  ProtractorBy,
  ProtractorExpectedConditions
} from 'protractor';

export interface Protractor {
  browser: Browser;
  element: ElementHelper;
  by: ProtractorBy;
  By: ProtractorBy;
  $: (search: string) => ElementFinder;
  $$: (search: string) => ElementArrayFinder;
  ExpectedConditions: ProtractorExpectedConditions;
}
interface global {};
export var protractor: Protractor = global['protractor'];
export var browser: Browser = global['protractor']['browser'];
export var element: ElementHelper = global['protractor']['element'];
export var by: ProtractorBy = global['protractor']['by'];
export var By: ProtractorBy = global['protractor']['By'];
export var $: (search: string) => ElementFinder = global['protractor']['$'];
export var $$: (search: string) => ElementArrayFinder = global['protractor']['$$'];
export var ExpectedConditions: ProtractorExpectedConditions =
    global['protractor']['ExpectedConditions'];
