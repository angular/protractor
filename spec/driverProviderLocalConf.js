var env = require('./environment');

exports.config = {

  framework: 'jasmine',

  specs: [
    'driverProviders/local/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
};
