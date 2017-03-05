
var reportingClient,
    user = 'daniela@perfectomobile.com',
    pass = 'Shelby1967',
    host = 'branchtest'; // Only host name 

var seleniumAddress2 = 'https://' + host + '.perfectomobile.com/nexperience/perfectomobile/wd/hub';
var capabilities2 = {
    deviceName: '00D65EA7964D2547',
    browserName: 'chrome',
    user: user,
    password: pass,
}

exports.config = {
  //Remote address			
  seleniumAddress: 'https://' + host + '.perfectomobile.com/nexperience/perfectomobile/wd/hub',

  //Capabilities to be passed to the webdriver instance.
  capabilities: {
    deviceName: 'ZX1G22FX2K',
    browserName: 'chrome',
    user: user,
    password: pass,
    // platformName: 'Windows',
    // platformVersion: '8.1',
    // browserName: 'Chrome',
    // browserVersion: '54',
    // location : 'US East'
  },

  retryMechanism: {
    retries: 3,
    delay: 10000, // delay in ms
  },

  //Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['spec.js'],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    showColors: true,	// Use colors in the command line report.	
    defaultTimeoutInterval: 120000	// Time to wait in ms before a test fails. Default value = 30000
  },

  onComplete: function () {
    // Output report URL
    return reportingClient.getReportUrl().then(
      function (url) {
        console.log(`Report url = ${url}`);
      }
    );
  },


  onPrepare: function () {
    const Reporting = require('perfecto-reporting');

    reportingClient = new Reporting.Perfecto.PerfectoReportingClient(new Reporting.Perfecto.PerfectoExecutionContext({
      webdriver: browser.driver,
      tags: ['javascript driver']
    }));
    browser.reportingClient = reportingClient;

    var myReporter = {
      specStarted: function (result) {
        reportingClient.testStart(result.fullName);
      },
      specDone: function (result) {
        if (result.status === 'failed') {
          const failure = result.failedExpectations[result.failedExpectations.length - 1];
          reportingClient.testStop({
            status: Reporting.Constants.results.failed,
            message: `${failure.message} ${failure.stack}`
          });
        } else {
          reportingClient.testStop({
            status: Reporting.Constants.results.passed
          });
        }
      }
    }

    jasmine.getEnv().addReporter(myReporter);
  }
}