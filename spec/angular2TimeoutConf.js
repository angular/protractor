var env = require('./environment');

// This is the configuration for a smoke test for an Angular2 application.
//
// *** NOTE ***
// As Angular2 is in rapid development, the test application that ships with
// the Protractor repository does not yet contain an Angular2 section. This
// configuration assumes that you are serving the examples from the
// angular/angular repository at localhost:8000.
// See https://github.com/angular/angular/blob/master/DEVELOPER.md for
// setup instructions.
//
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'ng2/timeout_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl
};
