// An example configuration file.
exports.config = {
  // ----- How to setup Selenium
  // There are three ways to specify how to use Selenium. Specify one of the
  // following:
  // 1. seleniumServerJar - to start Selenium Standalone locally.
  // 2. seleniumAddress - to connect to a Selenium server which is already
  //     running.
  // 3. sauceUser/sauceKey - to use remote Selenium servers via SauceLabs.

  // The location of the selenium standalone server .jar file.
  seleniumServerJar: './selenium/selenium-server-standalone-2.34.0.jar',
  // The port to start the selenium server on, or null if the server should
  // find its own unused port.
  seleniumPort: null,
  // Chromedriver location is used to help the selenium standalone server
  // find chromedriver. This will be passed to the selenium jar as
  // the system property webdriver.chrome.driver. If null, selenium will
  // attempt to find chromedriver using PATH.
  chromeDriver: './selenium/chromedriver',
  // Additional command line options to pass to selenium. For example,
  // if  you need to change the browser timeout, use
  // seleniumArgs: [-browserTimeout=60],
  seleniumArgs: [],

  // If sauceUser and sauceKey are specified, seleniumServerJar will be ignored.
  sauceUser: null,
  sauceKey: null,

  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: [
    'spec/*_spec.js',
  ],

  // ----- Capabilities to be passed to the webdriver instance.
  // For a full list of available capabilities, see
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities
  // and
  // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
  capabilities: {
    'browserName': 'chrome'
  },

  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:8000',

  // ----- Options to be passed to minijasminenode.
  jasmineNodeOpts: {
    // onComplete will be called before the driver quits.
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
};
