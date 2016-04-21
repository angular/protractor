declare var browser: any;

declare namespace webdriver {
  class WebDriver {
    getSession: Function;
    quit: Function;
    static attachToSession: Function;
  }

  class Session {
    getId: Function;
  }
}

declare class executors { static createExecutor: Function; }
