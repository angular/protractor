// A small suite to make sure the mocha frameowork works.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'mocha',

  // Spec patterns are relative to this directory.
  specs: [
    'mocha/*_spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000',

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
