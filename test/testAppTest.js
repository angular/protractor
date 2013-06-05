var webdriver = require('selenium-webdriver');
var protractor = require('../protractor.js');
var util = require('util');
var expect = require('expect.js');

describe('test application', function() {
  var driver, ptor;
  this.timeout(5000);


  before(function() {
    driver = new webdriver.Builder().
        usingServer('http://localhost:4444/wd/hub').
        withCapabilities({
          'browserName': 'chrome',
          'version': '',
          'platform': 'ANY',
          'javascriptEnabled': true
        }).build();

    ptor = protractor.wrapDriver(driver);

    driver.manage().timeouts().setScriptTimeout(10000);
  });

  after(function(done) {
    driver.quit().then(function() {done()});
  });

  describe('finding elements', function() {
    beforeEach(function() {
      ptor.get('http://localhost:8000/app/index.html#/bindings');
    });

    it('should find an element by binding', function(done) {
      done();
    });

    it('should find an element by input model', function(done) {
      expect(true).to.eql(true);
      done();
    });

    it('should find elements using a select', function(done) {
      ptor.findElement(protractor.By.selectedOption('planet')).
          getText().then(function(text) {
            expect(text).to.eql('Mercury');
          });

      // There must be a better way to do this.
      ptor.findElement(protractor.By.select('planet'))
          .findElement(protractor.By.css('option[value="4"]')).click();

      ptor.findElement(protractor.By.selectedOption('planet')).
          getText().then(function(text) {
            expect(text).to.eql('Jupiter');
            done();
          });
    });

    it('should find elements using a repeater', function(done) {
      // Returns the element for the entire row.
      ptor.findElement(protractor.By.repeater('ball in planets').row(3)).
          getText().then(function(text) {
            expect(text).to.eql('Earth:3');
          });

      // Returns the element in row 2 and the column with binding {{ball.name}}
      ptor.findElement(protractor.By.repeater('ball in planets').row(2).
          column('{{ball.name}}'))
            .getText().then(function(text) {
              expect(text).to.eql('Venus');
            });

      // Returns the entire column.
      ptor.findElements(protractor.By.repeater('ball in planets').
          column('{{ball.name}}'))
            .then(function(arr) {
              arr[1].getText().then(function(text) {
                expect(text).to.eql('Venus');
              });
              arr[2].getText().then(function(text) {
                expect(text).to.eql('Earth');
                done();
              });
            });
    });

    it('should find multiple elements by binding', function(done) {
      // There must be a better way to do this.
      ptor.findElement(protractor.By.select('planet'))
          .findElement(protractor.By.css('option[value="4"]')).click();

      ptor.findElements(protractor.By.binding('{{moon}}'))
          .then(function(arr) {
            arr[0].getText().then(function(text) {
              expect(text).to.eql('Europa');
            });
            arr[2].getText().then(function(text) {
              expect(text).to.eql('Ganymede');
              done();
            })
          });
    });
  });

  describe('mock modules', function() {
    // A module to override the 'version' service. This function will be
    // executd in the context of the application under test, so it may
    // not refer to any local variables.
    var mockModuleA = function() {
      var newModule = angular.module('moduleA', []);
      newModule.value('version', '2');
    };

    // A second module overriding the 'version' service. 
    // This module shows the use of a string for the load
    // function.
    // TODO(julie): Consider this syntax. Should we allow loading the
    // modules from files? Provide helpers?
    var mockModuleB = "angular.module('moduleB', []).value('version', '3');";

    afterEach(function() {
      ptor.clearMockModules();
    });

    it('should override services via mock modules', function(done) {
      ptor.addMockModule('moduleA', mockModuleA);

      ptor.get('http://localhost:8000/app/index.html');

      ptor.findElement(protractor.By.css('[app-version]')).
          getText().then(function(text) {
            expect(text).to.eql('2');
            done();
          });
    });

    it('should have the version of the last loaded module', function(done) {
      ptor.addMockModule('moduleA', mockModuleA);
      ptor.addMockModule('moduleB', mockModuleB);

      ptor.get('http://localhost:8000/app/index.html');

      ptor.findElement(protractor.By.css('[app-version]')).
          getText().then(function(text) {
            expect(text).to.eql('3');
            done();
          });
    });
  });

  describe('synchronizing with Angular', function() {    
    beforeEach(function() {
      ptor.get('http://localhost:8000/app/index.html');
    });

    it('should wait for slow RPCs', function(done) {
      var sample1Button = driver.findElement(protractor.By.id('sample1'));
      var sample2Button = driver.findElement(protractor.By.id('sample2'));
      sample1Button.click();

      var fetchButton = driver.findElement(protractor.By.id('fetch'));
      fetchButton.click();

      // The quick RPC works fine.
      var status = ptor.findElement(protractor.By.binding('{{status}}'));
      status.getText().then(function(text) {
        expect(text).to.eql('200');
      });
      ptor.findElement(protractor.By.binding("{{data}}")).
          getText().then(function(text) {
            expect(text).to.eql('done');
          });

      // Slow RPC.
      sample2Button.click();
      fetchButton.click();
      // Would normally need driver.sleep(2) or something.
      ptor.findElement(protractor.By.id('statuscode')).
          getText().then(function(text) {
            expect(text).to.eql('200');
          });
      ptor.findElement(protractor.By.id('data')).getText().
          then(function(text) {
            expect(text).to.eql('finally done');
            done();
          });
    });
  });
});
