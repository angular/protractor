// This configuration file shows an example of using an Jasmine reporter to
// output test results in XML format. Before running, you will need to
// npm install jasmine-reporters
require('jasmine-reporters');

// The main suite of Protractor tests.
exports.config = {
  seleniumServerJar: '../selenium/selenium-server-standalone-2.35.0.jar',
  chromeDriver: '../selenium/chromedriver',

  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'basic/*_spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  onPrepare: function() {
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter('xmloutput', true, true));
  },

  baseUrl: 'http://localhost:8000',
};
