var env = require('./environment.js');

// Test having two browsers interacting with each other.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine2',

  // Spec patterns are relative to this directory.
  specs: [
    'interaction/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl
};
