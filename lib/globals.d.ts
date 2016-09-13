// Used for Protractor mock module loader.
declare namespace angular {
  var module: Function;
}

// declare interface Window { [key: string]: any; }

declare namespace NodeJS {
  interface Process {
    [key: string]: any;
  }

  interface Global {
    // These are here because we tie these variables to the global namespace.
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
    // Helper function added by the debugger and element explorer
    list: (locator: any) => string[];
    [key: string]: any;
  }
}

declare interface IError extends Error {
  code?: number;
  stack?: string;
}
