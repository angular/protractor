var env = require('./environment');

/*
This file includes basic configuration to run your cucumber
feature files and step definitions with protractor.
**/
exports.config = {
  seleniumAddress: env.seleniumAddress,

  baseUrl: env.baseUrl,
  
  capabilities: env.capabilities,
  
  onPrepare: function () {
    browser.manage().window().maximize();
  },
  
  framework: 'custom',
  
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  
  // Specs here are the cucumber feature files
  specs: [
    './cucumber/*.feature'  
  ],
  
  cucumberOpts: {
    monochrome: true,
    strict: true,
    plugin: ["pretty"],
    // requiring step definition files
    require: ['./cucumber/*.js']
  }

}