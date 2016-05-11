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
    getCurrentUrl: Function;
    getPageSource: Function;
    getTitle: Function;
    navigate: Function;
    get: Function;
    wait: Function;
    schedule: Function;
    switchTo: Function;
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
