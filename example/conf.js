// An example configuration file.
exports.config = {
  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // If you would like to test against multiple browsers, use the multiCapabilities
  // configuration option instead.
  multiCapabilities: [{
    'browserName': 'firefox'
    }, {
    'browserName': 'chrome'
  }],

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['example_spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }

  // Specify a framework you wish to use. Default version is Jasmine v1.3.
    framework: 'jasmine2'
};
