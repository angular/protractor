// Typescript transpiling will give a warning about 'global'. This work around
// is to allow protractor to set global variables. Warning message as follows:
//
// lib/globals.d.ts(2,19): error TS2300: Duplicate identifier 'global'.
// typings/main/ambient/node/index.d.ts(33,13): error TS2300: Duplicate
// identifier 'global'.
declare var browser: any;
declare var protractor: any;
declare var $: any;
declare var $$: any;
declare var element: any;
declare var by: any;
declare var By: any;
declare var DartObject: any;

// Used for Protractor mock module loader.
declare namespace angular {
  var module: Function;
}

declare interface Object { [key: string]: any; }

declare interface Window { [key: string]: any; }

declare namespace NodeJS {
  interface Process {
    [key: string]: any;
  }

  interface Global {
    browser: any;
    protractor: any;
    $: any;
    $$: any;
    element: any;
    by: any;
    By: any;
    DartObject: any;
    // Helper function added by the debugger in protractor.ps
    list: (locator: webdriver.Locator) => string[];
    [key: string]: any;
  }
}

declare interface String { startsWith: Function; }

declare namespace webdriver {
  class WebDriver {
    findElements: Function;
    getSession: Function;
    quit: Function;
    executeScript: Function;
    getCapabilities: Function;
    navigate: Function;
    get: Function;
    wait: Function;
    schedule: Function;
    controlFlow: Function;
    static attachToSession: Function;
    // This index type allows looking up methods by name so we can do mixins.
    [key: string]: any;
  }

  class Session {
    getId: Function;
    getCapabilities: Function;
  }

  class Promise {
    controlFlow: Function;
    then: Function;
  }

  class Capabilities {
    get: Function;
  }

  class WebElement {
    getDriver: Function;
    isEnabled: Function;
    findElements: Function;
    isPresent: Function;
    getText: Function;
  }

  class ErrorCode {
    code: number;
  }

  interface Locator {
    toString(): string;
    isPresent?: Function;
  }
}
