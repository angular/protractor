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

  // util.puts(waitForAngular.toString());

  var contentLocatorJs = function(value) {
    // ...
  };

  return {
    findElement: function(locator, varArgs) {
      waitForAngular();
      return driver.findElement(locator, varArgs);
    },
    By: {
      'binding': function(value) { },
      'repeater': function(value) { },
      'input': function(value) { },
      'select': function(value) { },
      'content': function(value) {
	return {
	  using: 'js',
	  value: contentLocatorJs(value)
	};
      }
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
      // and then extract the stuff we care about.
    },
    getBinding: function(name) {
      var command = new webdriver.Command(webdriver.CommandName.FIND_ELEMENTS).
	setParameter('using', 'className').
	setParameter('value', 'ng-binding');
      return driver.schedule(command, 'Protractar find elements');
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

//var eventEmitter = new webdriver.EventEmitter();

//eventEmitter.addListener("DOMContentLoaded", function() {
//  util.puts("Webdriver got the DOMContentLoaded event");
//});

// driver.get('http://docs.angularjs.org/api/ng.$http');

driver.get('http://localhost:8000/app/index.html');
webdriver.promise.Application.getInstance().addListener('DOMContentLoaded', function(e) {
  util.puts("Webdriver got the DOMContentLoaded event");
  alert("Webdriver got the DOMContentLoaded event");
  util.puts("Webdriver got the DOMContentLoaded event");
});

driver.executeScript(function() {
  document.addEventListener("DOMContentLoaded", function() { alert("DOM LOADED!"); });
}).then(function() {
  util.puts("Finished executing the script");
});

var sample1Button = driver.findElement(webdriver.By.id('sample1'));
var sample2Button = driver.findElement(webdriver.By.id('sample2'));
sample1Button.click();

var fetchButton = driver.findElement(webdriver.By.id('fetch'));
//var fetchButtonB = driver.findElement(protractar.By.content('fetch'));
fetchButton.click();

var status = protractar.getBinding('status');
util.puts(status.toString);

// The quick RPC works fine.
protractar.findElement(webdriver.By.id('statuscode')).getText().then(function(text) {
  assert.equal('200', text);
});
protractar.findElement(webdriver.By.id('data')).getText().then(function(text) {
  assert.equal('diablo', text);
});

// The slow one fails:
sample2Button.click();
fetchButton.click();
// Would normally need driver.sleep(2) or something.
protractar.findElement(webdriver.By.id('statuscode')).getText().then(function(text) {
  assert.equal('200', text);
});
protractar.findElement(webdriver.By.id('data')).getText().then(function(text) {
  assert.equal('hello now', text);
});

driver.quit();
