var util = require('util');

describe('angularjs homepage', function() {
  var webdriver = require('selenium-webdriver');
  var protractor = require('./protractor.js');

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

  it('should greet using binding', function(done) {
    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

    ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
        getText().then(function(text) {
          expect(text).toEqual('Hello Julie!');
          done();
        });
  }, 10000);

  it('should greet using binding - #2', function(done) {
    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input("yourName")).sendKeys("Jane");

    ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
        getText().then(function(text) {
          expect(text).toEqual('Hello Jane!');
          done();
        });
  }, 10000);

  // Uncomment to see failures.
  /*
  it('should greet using binding - this one fails', function(done) {
    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

    ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
        getText().then(function(text) {
          expect(text).toEqual('Hello Jack');
          done();
        });
  });
  */
  

  it('afterAll', function() {
    // This is a sad hack to do any shutdown of the server.
    // TODO(juliemr): Add afterall functionality to jasmine-node
    driver.quit();
  })
});
