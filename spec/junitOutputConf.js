// This configuration file shows an example of using an Jasmine reporter to
// output test results in XML format. Before running, you will need to
// npm install jasmine-reporters

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'basic/*_spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

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
  },

  baseUrl: 'http://localhost:8000',
};
