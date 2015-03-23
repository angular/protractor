// Configuration using a function in onPrepare to set a parameter before
// testing.
var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  mockSelenium: true,

  framework: 'jasmine2',

  specs: [
    'onPrepare/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  onPrepare: function() {
    browser.params.password = '12345';
  }
};
