// Configuration using a function in onPrepare to set a parameter before
// testing.
var env = require('./environment.js');
var q = require('q');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine2',

  specs: [
    'onPrepare/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  onPrepare: function() {
    return q.fcall(function() {
      browser.params.password = '12345';
    }).delay(1000);
  }
};
