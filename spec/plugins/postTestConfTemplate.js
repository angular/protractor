var env = require('../environment.js');

module.exports = function(framework) {
  return {
    mockSelenium: true,

    framework: framework,

    specs: [
      'specs/simple_spec.js'
    ],

    capabilities: env.capabilities,

    baseUrl: env.baseUrl + '/ng1/',

    plugins: [{
      path: 'plugins/post_test_plugin.js'
    }]
  };
};
