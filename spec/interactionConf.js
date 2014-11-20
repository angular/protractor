var env = require('./environment.js');

// Test having two browsers interacting with each other.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  specs: [
    'interaction/*_spec.js'
  ],

  numDrivers: 2,

  capabilities: env.capabilities,

  baseUrl: env.baseUrl
};
