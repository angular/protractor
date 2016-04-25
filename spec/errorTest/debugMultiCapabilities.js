var env = require('../environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  framework: 'jasmine',
  debug: true,
  specs: [
    '../../example/example_spec.js'
  ],
  multiCapabilities: [{
    'browserName': 'chrome'
  },{
    'browserName': 'firefox'
  }],
  baseUrl: env.baseUrl,
};
