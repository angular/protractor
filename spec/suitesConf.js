var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  suites: {
    okspec: 'suites/ok_spec.js',
    okmany: ['suites/ok_spec.js', 'suites/ok_2_spec.js'],
    failingtest: 'suites/always_fail_spec.js',
    checksuitename: 'suites/check_test_suite_name.js'
  },

  specs: [
    'suites/check_test_suite_name_without_suite.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
};
