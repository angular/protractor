var env = require('./environment');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'driverProviders/attachSession/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
};
