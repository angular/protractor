const env = require('../environment.js');

exports.config = {
  lambdaUsername: 'foobar',
  lambdaAccessKey: 'foobar',
  SELENIUM_PROMISE_MANAGER: false,
  framework: 'jasmine',
  specs: ['../../example/example_spec.js'],
  capabilities: {browserName: 'chrome'},
  baseUrl: env.baseUrl + '/ng1/',
  jasmineNodeOpts: {defaultTimeoutInterval: 90000}
};