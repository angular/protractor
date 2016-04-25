// Typescript transpiling will give a warning about 'global'. This work around
// is to allow protractor to set global variables. Warning message as follows:
//
// lib/globals.d.ts(2,19): error TS2300: Duplicate identifier 'global'.
// typings/main/ambient/node/index.d.ts(33,13): error TS2300: Duplicate
// identifier 'global'.
declare namespace global {
  var browser: any;
  var protractor: any;
  var $: any;
  var $$: any;
  var element: any;
  var by: any;
  var By: any;
  var DartObject: any;
}
declare var browser: any;
declare var protractor: any;
declare var $: any;
declare var $$: any;
declare var element: any;
declare var by: any;
declare var By: any;
declare var DartObject: any;

declare namespace webdriver {
  class WebDriver {
    findElements: Function;
    getSession: Function;
    quit: Function;
    static attachToSession: Function;
  }

  class Session {
    getId: Function;
    getCapabilities: Function;
  }

  class Promise {
    controlFlow: Function;
    then: Function;
  }

  class WebElement {
    getDriver: Function;
    isEnabled: Function;
    findElements: Function;
  }

  interface Locator {
    toString(): string;
  }
}
