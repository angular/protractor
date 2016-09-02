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
    list: (locator: any) => string[];
    [key: string]: any;
  }
}

declare interface IError extends Error {
  code?: number;
  stack?: string;
}

declare interface String { startsWith: Function; }

declare namespace webdriver {
  class ErrorCode {
    code: number;
  }
}

declare interface HttpProxyAgent { constructor(opts: Object): HttpProxyAgent; }
