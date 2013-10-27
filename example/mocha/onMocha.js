/**
 * This example shows how to use the protractor library in a Mocha test.
 * It assumes that a selenium server is running at localhost:4444.
 * Run this test with:
 *   mocha onMocha.js
 */

var util = require('util');
var expect = require('expect.js');
var webdriver = require('selenium-webdriver');
var protractor = require('../lib/protractor.js');

describe('angularjs.org homepage', function() {
  this.timeout(80000);

  var driver, ptor;

  before(function() {
    driver = new webdriver.Builder().
        usingServer('http://localhost:4444/wd/hub').
        withCapabilities(webdriver.Capabilities.chrome()).build();

    driver.manage().timeouts().setScriptTimeout(10000);
    ptor = protractor.wrapDriver(driver);
  });

  after(function(done) {
    driver.quit().then(function() {done()});
  })

  it('should greet using binding', function(done) {
    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input('yourName')).sendKeys('Julie');

    ptor.findElement(protractor.By.binding('{{yourName}}')).
        getText().then(function(text) {
          expect(text).to.eql('Hello Julie!');
          done();
        });
  });

  it('should list todos', function(done) {
    ptor.get('http://www.angularjs.org');

    var todo = ptor.findElement(
        protractor.By.repeater('todo in todos').row(2));

    todo.getText().then(function(text) {
      expect(text).to.eql('build an angular app');
      done();
    });
  });

  // Uncomment to see failures.
  
  // it('should greet using binding - this one fails', function(done) {
  //   ptor.get('http://www.angularjs.org');

  //   ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

  //   ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
  //       getText().then(function(text) {
  //         expect(text).to.eql('Hello Jack');
  //         done();
  //       });
  // });
  
});
