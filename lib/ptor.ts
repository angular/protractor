import {Browser, ElementHelper} from './browser';
import {ProtractorBy} from './locators';
import {ElementFinder, ElementArrayFinder} from './element';

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
}
