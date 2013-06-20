// An example configuration file.
exports.config = {
  // The address of a running selenium server. If this is specified,
  // seleniumServerJar and seleniumPort will be ignored.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:8000',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    // Spec folders are relative to the current working directly when
    // protractor is called. This can be folders or files.
    specFolders: ['example/onProtractor.js'],
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
};
