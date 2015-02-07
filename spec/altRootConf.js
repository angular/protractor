var env = require('./environment.js');

// Tests for an Angular app where ng-app is not on the body.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine2',

  // Spec patterns are relative to this config.
  specs: [
    'altRoot/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  // Selector for the element housing the angular app.
  rootElement: 'div#nested-ng-app'
};
