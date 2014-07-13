// Reference Configuration File
//
// This file shows all of the configuration options that may be passed
// to Protractor.


exports.config = {
  // ---------------------------------------------------------------------------
  // ----- How to setup Selenium -----------------------------------------------
  // ---------------------------------------------------------------------------
  //
  // There are three ways to specify how to use Selenium. Specify one of the
  // following:
  //
  // 1. seleniumServerJar - to start a standalone Selenium Server locally.
  // 2. seleniumAddress - to connect to a Selenium Server which is already
  //    running.
  // 3. sauceUser/sauceKey - to use remote Selenium Servers via Sauce Labs.
  //
  // You can bypass a Selenium Server if you only want to test using chrome.
  // Set chromeOnly to true and chromeDriver will be used directly (from the
  // location specified in chromeDriver).

  // The location of the selenium standalone server jar file, relative
  // to the location of this config. If no other method of starting selenium
  // is found, this will default to
  // node_modules/protractor/selenium/selenium-server...
  seleniumServerJar: null,
  // The port to start the Selenium Server on, or null if the server should
  // find its own unused port.
  seleniumPort: null,
  // Additional command line options to pass to selenium. For example,
  // if you need to change the browser timeout, use
  // seleniumArgs: ['-browserTimeout=60'],
  seleniumArgs: [],
  // Chromedriver location is used to help the standalone Selenium Server
  // find the chromedriver binary. This will be passed to the selenium jar as
  // the system property webdriver.chrome.driver. If null, selenium will
  // attempt to find chromedriver using PATH.
  chromeDriver: './selenium/chromedriver',

  // If true, only chromedriver will be started, not a standalone selenium.
  // Tests for browsers other than chrome will not run.
  chromeOnly: false,

  // The address of a running Selenium Server. If specified, Protractor will
  // connect to an already running instance of selenium. This usually looks like
  // seleniumAddress: 'http://localhost:4444/wd/hub'
  seleniumAddress: null,

  // If sauceUser and sauceKey are specified, seleniumServerJar will be ignored.
  // The tests will be run remotely using Sauce Labs.
  sauceUser: null,
  sauceKey: null,

  // ---------------------------------------------------------------------------
  // ----- What tests to run ---------------------------------------------------
  // ---------------------------------------------------------------------------

  // Spec patterns are relative to the location of this config.
  specs: [
    'spec/*_spec.js',
  ],

  // Patterns to exclude.
  exclude: [],

  // Alternatively, suites may be used. When run without a command line
  // parameter, all suites will run. If run with --suite=smoke, only the
  // patterns matched by that suite will run.
  suites: {
    smoke: 'spec/smoketests/*.js',
    full: 'spec/*.js'
  },

  // ---------------------------------------------------------------------------
  // ----- How to set up browsers ----------------------------------------------
  // ---------------------------------------------------------------------------
  //
  // Protractor can launch your tests on one or more browsers. If you are
  // testing on a single browser, use the capabilities option. If you are
  // testing on multiple browsers, use the multiCapabilities array.

  // For a list of available capabilities, see
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities
  //
  // In addition, you may specify count, shardTestFiles, and maxInstances.
  capabilities: {
    browserName: 'chrome',

    // Number of times to run this set of capabilities (in parallel, unless 
    // limited by maxSessions). Default is 1.
    count: 1, 

    // If this is set to be true, specs will be sharded by file (i.e. all
    // files to be run by this set of capabilities will run in parallel).
    // Default is false.
    shardTestFiles: false,

    // Maximum number of browser instances that can run in parallel for this
    // set of capabilities. This is only needed if shardTestFiles is true.
    // Default is 1.
    maxInstances: 1,

    // Additional spec files to be run on this capability only.
    specs: ['spec/chromeOnlySpec.js']
  },

  // If you would like to run more than one instance of webdriver on the same
  // tests, use multiCapabilities, which takes an array of capabilities.
  // If this is specified, capabilities will be ignored.
  multiCapabilities: [],

  // Maximum number of total browser sessions to run. Tests are queued in
  // sequence if number of browser sessions is limited by this parameter.
  // Use a number less than 1 to denote unlimited. Default is unlimited.
  maxSessions: -1,

  // ---------------------------------------------------------------------------
  // ----- Global test information ---------------------------------------------
  // ---------------------------------------------------------------------------
  //
  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:9876',

  // Selector for the element housing the angular app - this defaults to
  // body, but is necessary if ng-app is on a descendant of <body>.
  rootElement: 'body',

  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 11000,

  // A callback function called once protractor is ready and available, and
  // before the specs are executed.
  // If multiple capabilities are being run, this will run once per
  // capability.
  // You can specify a file containing code to run by setting onPrepare to
  // the filename string.
  onPrepare: function() {
    // At this point, global variable 'protractor' object will be set up, and
    // globals from the test framework will be available. For example, if you
    // are using Jasmine, you can add a reporter with:
    //     jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
    //         'outputdir/', true, true));
  },

  // A callback function called once tests are finished.
  onComplete: function() {
    // At this point, tests will be done but global objects will still be
    // available.
  },

  // A callback function called once the tests have finished running and
  // the webdriver instance has been shut down. It is passed the exit code
  // (0 if the tests passed or 1 if not). This is called once per capability.
  onCleanUp: function(exitCode) {},

  // The params object will be passed directly to the protractor instance,
  // and can be accessed from your test as browser.params. It is an arbitrary
  // object and can contain anything you may need in your test.
  // This can be changed via the command line as:
  //   --params.login.user 'Joe'
  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  },

  // ---------------------------------------------------------------------------
  // ----- The test framework --------------------------------------------------
  // ---------------------------------------------------------------------------

  // Test framework to use. This may be jasmine, cucumber, or mocha.
  //
  // Jasmine is fully supported as a test and assertion framework.
  // Mocha and Cucumber have limited beta support. You will need to include your
  // own assertion framework (such as Chai) if working with Mocha.
  framework: 'jasmine',
  
  // Options to be passed to minijasminenode.
  //
  // See the full list at https://github.com/juliemr/minijasminenode/tree/jasmine1
  jasmineNodeOpts: {
    // If true, display spec names.
    isVerbose: false,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 30000
  },

  // Options to be passed to mocha.
  //
  // See the full list at http://visionmedia.github.io/mocha/
  mochaOpts: {
    ui: 'bdd',
    reporter: 'list'
  },

  // Options to be passed to cucumber.
  cucumberOpts: {
    // Require files before executing the features.
    require: 'cucumber/stepDefinitions.js',
    // Only execute the features or scenarios with tags matching @dev.
    // This may be an array of strings to specify multiple tags to include.
    tags: '@dev',
    // How to format features (default: progress)
    format: 'summary'
  }
};
