// Change to the location of your webdriverjs module.
var webdriver =
  require('/Users/ralphj/selenium/selenium-read-only/build/javascript/node/webdriver');
var assert = require('assert');
var util = require('util');


var makeProtractar = function(driver) {
  var driver = driver;

  var waitForAngular = function() {
    return driver.executeAsyncScript(function() {
      var callback = arguments[arguments.length - 1];
      angular.element(document.body).injector().get('$browser').notifyWhenNoOutstandingRequests(callback);
    });
  };

  return {
    findElement: function(locator, varArgs) {
      waitForAngular();
      return driver.findElement(locator, varArgs);
    },
      // Could either make fancy webdriver location strategies here,
      // (maybe using webdriver.By.js?) This is difficult because
      // we cannot assume that the AUT has jQuery or any kind of intelligent
      // CSS selectors available. Angular's JQLite does not implement
      // any advanced selection functions, just find by tag.
      // 
      // Or could make my own strategy that implements the same webdriver
      // interface. (needs to schedule a command - see command.js)
      // Problem: webdriver.CommandName is not exported, nor is webdriver.Command.
      //
      // Seems like the alternative is to use a webdriver.findElements(webdriver.By...)
      // and then extract the stuff we care about. This is hard to do became the WebElements
      // that are returned are pretty basic - we can't use data() to get at their
      // bindings, for example.
    getBinding: function(name) {
/*      var bindingElements = driver.findElements(webdriver.By.className("ng-binding")).then(function(elems) {
	util.puts(elems.length);
	util.puts(elems[0].getText());
      });
      util.puts(bindingElements.toString());*/


      // OR

      /*
      var getBinding = function(name) {
        return function() {
	  
	};
      };

      util.puts(getBinding(name).toString());

      return driver.findElements(webdriver.By.js(getBinding(name)));
       */
    }
  };
};


var driver = new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities({
      'browserName': 'chrome',
      'version': '',
      'platform': 'ANY',
      'javascriptEnabled': true
    }).build();

var protractar = makeProtractar(driver);

driver.manage().timeouts().setScriptTimeout(10000);

webdriver.promise.Application.getInstance().addListener('DOMContentLoaded', function(e) {
  util.puts("Webdriver got the DOMContentLoaded event");
  alert("Webdriver got the DOMContentLoaded event");
  util.puts("Webdriver got the DOMContentLoaded event");
});;

driver.get('http://localhost:8000/app/index.html');

// This doesn't seem to do anything.
webdriver.promise.Application.getInstance().addListener('DOMContentLoaded', function(e) {
  util.puts("Webdriver got the DOMContentLoaded event");
  alert("Webdriver got the DOMContentLoaded event");
  util.puts("Webdriver got the DOMContentLoaded event");
});

// This happens too late to get executed.
driver.executeScript(function() {
  document.addEventListener("DOMContentLoaded", function() { alert("DOM LOADED!"); });
}).then(function() {
  util.puts("Finished executing the script");
});

var sample1Button = driver.findElement(webdriver.By.id('sample1'));
var sample2Button = driver.findElement(webdriver.By.id('sample2'));
sample1Button.click();

var fetchButton = driver.findElement(webdriver.By.id('fetch'));
fetchButton.click();

var status = protractar.getBinding('status');
// util.puts(status.toString);

// The quick RPC works fine.
protractar.findElement(webdriver.By.id('statuscode')).getText().then(function(text) {
  assert.equal('200', text);
});
protractar.findElement(webdriver.By.id('data')).getText().then(function(text) {
  assert.equal('done', text);
});

// Slow RPC.
sample2Button.click();
fetchButton.click();
// Would normally need driver.sleep(2) or something.
protractar.findElement(webdriver.By.id('statuscode')).getText().then(function(text) {
  assert.equal('200', text);
});
protractar.findElement(webdriver.By.id('data')).getText().then(function(text) {
  assert.equal('finally done', text);
});

driver.quit();
