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

  class Promise {
    then: Function;
  }

  class WebElement {
    getDriver: Function;
    isEnabled: Function;
    findElements: Function;
  }
}
