var webdriver = require('selenium-webdriver');
var protractor = require('./protractor.js');
var assert = require('assert');
var util = require('util');

var driver = new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities({
      'browserName': 'chrome',
      'version': '',
      'platform': 'ANY',
      'javascriptEnabled': true
    }).build();

driver.manage().timeouts().setScriptTimeout(10000);
var ptor = protractor.wrapDriver(driver);

ptor.get('http://www.angularjs.org');

ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
    getText().then(function(text) {
      assert.equal('Hello Julie!', text);
    });

// Uncomment to see failures.
// ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
//     getText().then(function(text) {
//       assert.equal('Hello Jack!', text);
//     });
