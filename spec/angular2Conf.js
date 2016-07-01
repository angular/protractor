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
    'ng2/async_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  // Special option for Angular2, to test against all Angular2 applications
  // on the page. This means that Protractor will wait for every app to be
  // stable before each action, and search within all apps when finding
  // elements.
  useAllAngular2AppRoots: true,

  // Alternatively, you could specify one root element application, to test
  // against only that one:
  // rootElement: 'async-app'
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000
  }
};
