exports.config = require('./angular2Conf.js').config;

exports.config.sauceUser = process.env.SAUCE_USERNAME;
exports.config.sauceKey = process.env.SAUCE_ACCESS_KEY;
exports.config.seleniumAddress = undefined;

// TODO: add in firefox when issue #2784 is fixed
exports.config.multiCapabilities = [{
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor suite tests',
    'version': '47',
    'selenium-version': '2.48.2',
    'chromedriver-version': '2.19',
    'platform': 'OS X 10.9'
  }];
exports.config.capabilities = undefined;
