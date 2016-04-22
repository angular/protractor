var env = require('../environment.js');

exports.config = {
  sauceUser: 'foobar',
  sauceKey: 'foobar',

  framework: 'jasmine',

  specs: [
    '../../example/example_spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: env.baseUrl + '/ng1/',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 90000
  }

};
