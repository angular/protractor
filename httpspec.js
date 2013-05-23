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

var ptor = protractor.wrapDriver(driver);

driver.manage().timeouts().setScriptTimeout(10000);

// A module to override the 'version' service. 
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

ptor.addMockModule('moduleA', mockModuleA);
ptor.addMockModule('moduleB', mockModuleB);

// The value of version will be '3' because mockModuleB is loaded last.
ptor.get('http://localhost:8000/app/index.html');

// Could still use driver.get to get a URL normally, without injecting modules.

ptor.findElement(protractor.By.css('[app-version]')).getText().then(function(text) {
  assert.equal('3', text);
});

var sample1Button = driver.findElement(protractor.By.id('sample1'));
var sample2Button = driver.findElement(protractor.By.id('sample2'));
sample1Button.click();

var fetchButton = driver.findElement(protractor.By.id('fetch'));
fetchButton.click();

// The quick RPC works fine.
var status = ptor.findElement(protractor.By.binding('{{status}}'));
status.getText().then(function(text) {
  assert.equal('200', text);
});
ptor.findElement(protractor.By.binding("{{data}}")).getText().then(function(text) {
  assert.equal('done', text);
});

// Slow RPC.
sample2Button.click();
fetchButton.click();
// Would normally need driver.sleep(2) or something.
ptor.findElement(protractor.By.id('statuscode')).getText().then(function(text) {
  assert.equal('200', text);
});
ptor.findElement(protractor.By.id('data')).getText().then(function(text) {
  assert.equal('finally done', text);
});

// Custom length RPC.
var urlBox = ptor.findElement(protractor.By.input('url'));
urlBox.clear();
urlBox.sendKeys('/3seccall');
fetchButton.click();
ptor.findElement(protractor.By.id('data')).getText().then(function(text) {
  assert.equal('done after 3 seconds', text);
});

ptor.clearMockModules();
ptor.addMockModule('moduleA', mockModuleA);

ptor.get('http://localhost:8000/app/index.html#/bindings');

// Now, version should be 2, since only moduleA has been loaded.
ptor.findElement(protractor.By.css('[app-version]')).getText().then(function(text) {
  assert.equal('2', text);
});

// Test using selects.
ptor.findElement(protractor.By.selectedOption('planet')).getText().then(function(text) {
  assert.equal('Mercury', text);
});

ptor.findElement(protractor.By.select('planet'))
    .findElement(protractor.By.css('option[value="4"]')).click(); // There must be a better way to do this.

ptor.findElement(protractor.By.selectedOption('planet')).getText().then(function(text) {
  assert.equal('Jupiter', text);
});

// Returns the element for the entire row.
ptor.findElement(protractor.By.repeater('ball in planets').row(3)).getText()
    .then(function(text) {
      assert.equal('Earth:3', text);
    });

// Returns the element in row 2 and the column with binding {{ball.name}}
ptor.findElement(protractor.By.repeater('ball in planets').row(2).column('{{ball.name}}'))
    .getText().then(function(text) {
      assert.equal('Venus', text);
    });

// Returns the entire column.
ptor.findElements(protractor.By.repeater('ball in planets').column('{{ball.name}}'))
    .then(function(arr) {
      arr[1].getText().then(function(text) {
        assert.equal('Venus', text);
      });
      arr[2].getText().then(function(text) {
        assert.equal('Earth', text);
      });
    });

// Test getting multiple elements via a binding.
ptor.findElements(protractor.By.binding('{{moon}}'))
    .then(function(arr) {
      arr[0].getText().then(function(text) {
        assert.equal('Europa', text);
      });
      arr[2].getText().then(function(text) {
        assert.equal('Ganymede', text);
      })
    })
driver.quit();
