var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  // not having a selenium address will allow for local connections

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'driverProviders/local/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',
};
