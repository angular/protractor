var env = require('../../../spec/environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  framework: 'jasmine2',
  specs: ['pass_spec.js'],
  baseUrl: env.baseUrl,
  plugins: [{
    path: '../index.js',
    failOnWarning: false,
    failOnError: false
  }]
};
