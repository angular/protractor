// A suite of tests to run on two browsers at once.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to this directory.
  specs: [
    'basic/lib_spec.js'
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
