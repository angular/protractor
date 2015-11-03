var env = require('../../../spec/environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  framework: 'jasmine',
  specs: ['pass_spec.js'],
  baseUrl: env.baseUrl,
  plugins: [{
    path: '../index.js',
    failOnWarning: true,
    logWarnings: false,
    failOnError: false
  }]
};
