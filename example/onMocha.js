var util = require('util');
var expect = require('expect.js');
var webdriver = require('selenium-webdriver');
var protractor = require('../lib/protractor.js');

describe('angularjs homepage', function() {
  this.timeout(8000);

  var driver, ptor;

  before(function() {
    driver = new webdriver.Builder().
        usingServer('http://localhost:4444/wd/hub').
        withCapabilities({
          'browserName': 'chrome',
          'version': '',
          'platform': 'ANY',
          'javascriptEnabled': true
        }).build();

    driver.manage().timeouts().setScriptTimeout(10000);
    ptor = protractor.wrapDriver(driver);
  });

  after(function(done) {
    driver.quit().then(function() {done()});
  })

  it('should greet using binding', function(done) {
    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

    ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
        getText().then(function(text) {
          expect(text).to.eql('Hello Julie!');
          done();
        });
  });

  it('should greet using binding - #2', function(done) {
    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input("yourName")).sendKeys("Jane");

    ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
        getText().then(function(text) {
          expect(text).to.eql('Hello Jane!');
          done();
        });
  });

  // Uncomment to see failures.
  /*
  it('should greet using binding - this one fails', function(done) {
    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

    ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
        getText().then(function(text) {
          expect(text).to.eql('Hello Jack');
          done();
        });
  });
  */
});
