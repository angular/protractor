var webdriver = require('/Users/ralphj/selenium/selenium-read-only/build/javascript/node/webdriver');
var assert = require('assert');
var util = require('util')


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
	}).
    build();

var protractar = makeProtractar(driver);

driver.manage().timeouts().setScriptTimeout(10000);

// driver.get('http://docs.angularjs.org/api/ng.$http');

driver.get('http://localhost:8000/app/index.html');
driver.sleep(2);

var sample1Button = driver.findElement(webdriver.By.id('sample1'));
var sample2Button = driver.findElement(webdriver.By.id('sample2'));
sample1Button.click();

var fetchButton = driver.findElement(webdriver.By.id('fetch'));
fetchButton.click();

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

// Better way to write this - protractar.findElement(...)?


driver.quit();

// Original Angular scenario runner code
/*
describe("api/ng.$http", function() {
	beforeEach(function() {
		browser().navigateTo("index-nocache.html#!/api/ng.$http");
	    });
  
	it('should make an xhr GET request', function() {
		element(':button:contains("Sample GET")').click();
		element(':button:contains("fetch")').click();
		expect(binding('status')).toBe('200');
		expect(binding('data')).toMatch(/Hello, \$http!/);
	    });
    
	it('should make a JSONP request to angularjs.org', function() {
		element(':button:contains("Sample JSONP")').click();
		element(':button:contains("fetch")').click();
		expect(binding('status')).toBe('200');
		expect(binding('data')).toMatch(/Super Hero!/);
	    });
    
	it('should make JSONP request to invalid URL and invoke the error handler',
	   function() {
	       element(':button:contains("Invalid JSONP")').click();
	       element(':button:contains("fetch")').click();
	       expect(binding('status')).toBe('0');
	       expect(binding('data')).toBe('Request failed');
	   });

    });
*/