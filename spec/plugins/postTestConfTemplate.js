var env = require('../environment.js');

module.exports = function(framework) {
  return {
    mockSelenium: true,

    framework: framework,

    specs: [
      'specs/simple_spec.js'
    ],

    capabilities: env.capabilities,

    baseUrl: env.baseUrl,

    plugins: [{
      path: 'plugins/post_test_plugin.js'
    }]
  };
};
