import {Browser, ElementHelper} from './browser';
import {ProtractorBy} from './locators';
import {ElementFinder, ElementArrayFinder} from './element';

export class protractor {
  static browser: Browser;
  static $ = function(search: string): ElementFinder { return null; };
  static $$ = function(search: string): ElementArrayFinder { return null; };
  static element: ElementHelper;
  static By: ProtractorBy;
  static by: ProtractorBy;
}
