import {ElementHelper, ProtractorBrowser} from './browser';
import {ElementArrayFinder, ElementFinder} from './element';
import {ProtractorExpectedConditions} from './expectedConditions';
import {ProtractorBy} from './locators';
import {Ptor} from './ptor';

// Re-export public types.
export {ElementHelper, ProtractorBrowser} from './browser';
export {Config} from './config';
export {ElementArrayFinder, ElementFinder} from './element';
export {ProtractorExpectedConditions} from './expectedConditions';
export {ProtractorBy} from './locators';
export {Ptor} from './ptor';

// Export API instances based on the global Protractor object.
// We base this on NodeJS `global` because we do not want to mask
// with a different instance of Protractor if the module is
// installed both globally and locally.
export let protractor: Ptor = (global as any)['protractor'];
export let browser: ProtractorBrowser = protractor.browser;
export let $: (search: string) => ElementFinder = protractor.$;
export let $$: (search: string) => ElementArrayFinder = protractor.$$;
export let element: ElementHelper = protractor.element;
export let By: ProtractorBy = protractor.By;
export let by: ProtractorBy = protractor.by;
export let wrapDriver:
    (webdriver: any, baseUrl?: string, rootElement?: string,
     untrackOutstandingTimeouts?: boolean) => ProtractorBrowser =
        protractor.wrapDriver;
export let ExpectedConditions: ProtractorExpectedConditions =
    protractor.ExpectedConditions;
