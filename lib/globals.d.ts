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
    ExpectedConditions: any;
    DartObject: any;
    Command: any;
    CommandName: any;
    // Helper function added by the debugger in protractor.ps
    list: (locator: webdriver.Locator) => string[];
    [key: string]: any;
  }
}

declare interface IError extends Error {
  code?: number;
  stack?: string;
}

declare interface String { startsWith: Function; }

declare namespace webdriver {
  namespace promise {
    interface Promise<T> {
      controlFlow: Function;
    }
  }

  namespace util {
    interface Condition {}
  }

  class ErrorCode {
    code: number;
  }

  interface Locator {
    toString(): string;
    isPresent?: Function;
  }
}

declare interface HttpProxyAgent { constructor(opts: Object): HttpProxyAgent; }
