// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to this directory.
  specs: [
    'basic/lib_spec.js'
  ],

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],

  chromeOnly: false,

  multiCapabilities: [{
    'browserName': 'chrome'
  }, {
    'browserName': 'firefox'
  }],

  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8000'),

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
