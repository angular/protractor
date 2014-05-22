var env = require('./environment.js');

// This configuration file shows an example of using an Jasmine reporter to
// output test results in XML format. Before running, you will need to
// npm install jasmine-reporters

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  specs: [
    'basic/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  onPrepare: function() {
    // The require statement must be down here, since jasmine-reporters
    // needs jasmine to be in the global and protractor does not guarantee
    // this until inside the onPrepare function.
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter('xmloutput', true, true));
  },

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
