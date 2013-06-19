// An example configuration file.
exports.config = {

  // The location of the selenium standalone server .jar file.
  seleniumServerJar: '../selenium/selenium-server-standalone-2.28.0.jar',
  // The port to start the selenium server on, or null if the server should
  // find its own unused port.
  seleniumPort: null,

  sauceUser: null,
  sauceKey: null,

  // The address of a running selenium server. If this is specified,
  // seleniumServerJar and seleniumPort will be ignored.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    // Spec folders are relative to the current working directly when
    // protractor is called.
    specFolders: ['spec/angularDotOrgSpec.js'],
    // onComplete will be called before the driver quits.
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
};
