import {
  Browser,
  ElementArrayFinder,
  ElementFinder,
  ElementHelper,
  ProtractorBy,
  ProtractorExpectedConditions
} from 'protractor';

export var browser: Browser = global['browser'];
export var element: ElementHelper = global['element'];
export var by: ProtractorBy = global['by'];
export var By: ProtractorBy = global['By'];
export var $: (search: string) => ElementFinder = global['$'];
export var $$: (search: string) => ElementArrayFinder = global['$$'];
export var ExpectedConditions: ProtractorExpectedConditions = global['ExpectedConditions'];
