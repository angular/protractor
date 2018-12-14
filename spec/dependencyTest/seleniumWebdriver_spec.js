var WebDriver = require('selenium-webdriver').WebDriver;
var By = require('selenium-webdriver').By;
var Setup = require('./setup');
var Chrome = require('selenium-webdriver/chrome');
var Firefox = require('selenium-webdriver/firefox');
var SeleniumError = require('selenium-webdriver').error;
var Remote = require('selenium-webdriver/remote');

var WEBDRIVER = {
  staticFunctions: ['createSession'],

  instanceFunctions: ['actions', 'wait', 'sleep', 'getCurrentUrl', 'getTitle',
    'takeScreenshot', 'getSession', 'getCapabilities', 'quit', 
    'executeAsyncScript', 'wait', 'getWindowHandle',
    'getAllWindowHandles', 'getPageSource', 'close', 'get', 'findElement',
    'findElements', 'manage', 'navigate', 'switchTo']
};

var WEBELEMENT = {
  instanceFunctions: ['getDriver', 'getId', 'findElement', 'click', 'sendKeys', 'getTagName',
    'getCssValue', 'getAttribute', 'getText', 'getRect', 'isEnabled', 'isSelected',
    'submit', 'clear', 'isDisplayed', 'takeScreenshot']
};
var BY = {
  staticFunctions: ['className', 'css', 'id', 'linkText', 'js', 'name',
      'partialLinkText', 'tagName', 'xpath']
};
var SESSION = {
  instanceFunctions: ['getId', 'getCapabilities']
};
var CHROME = {
  staticFunctions: ['Driver', 'ServiceBuilder']
};
var FIREFOX = {
  staticFunction: 'Driver'
};

describe('selenium-webdriver dependency', function() {
  describe('require("selenium-webdriver").WebDriver', function() {
    it('should have static functions', function() {
      for (var pos in WEBDRIVER.staticFunctions) {
        var staticFunc = WEBDRIVER.staticFunctions[pos];
        expect(typeof WebDriver[staticFunc] == 'function').toBe(true);
      }
    });

    it('should have instance functions', function() {
      var webdriver = Setup.getWebDriver();
      for (var pos in WEBDRIVER.instanceFunctions) {
        var instanceFunc = WEBDRIVER.instanceFunctions[pos];
        expect(typeof webdriver[instanceFunc] == 'function').toBe(true);
      }
    });
  });

  describe('require("selenium-webdriver").WebElement', function() {
    it('should have a instance functions', function() {
      var webElement = Setup.getWebElement();
      for (var pos in WEBELEMENT.instanceFunctions) {
        var func = WEBELEMENT.instanceFunctions[pos];
        expect(typeof webElement[func] == 'function').toBe(true);
      }
    });
  });

  describe('require("selenium-webdriver").By', function() {
    it('should have a static functions', function() {
      for (var pos in BY.staticFunctions) {
        var func = BY.staticFunctions[pos];
        expect(typeof By[func] == 'function').toBe(true);
      }
    });
  });

  describe('require("selenium-webdriver").Session', function() {
    it('should have a instance functions', function() {
      var session = Setup.getSession();
      for (var pos in SESSION.instanceFunctions) {
        var func = SESSION.instanceFunctions[pos];
        expect(typeof session[func] == 'function').toBe(true);
      }
    });
  });

  describe('require("selenium-webdriver/chrome")', function() {
    it('should have a static functions', function() {
      for (var pos in CHROME.staticFunctions) {
        var func = CHROME.staticFunctions[pos];
        expect(typeof Chrome[func] == 'function').toBe(true);
      }
    });
  });

  describe('require("selenium-webdriver/firefox")', function() {
    it('should have a ' + FIREFOX.staticFunction + ' function', function() {
      expect(typeof Firefox[FIREFOX.staticFunction] == 'function').toBe(true);
    });
  });
  describe('require("selenium-webdriver").error', function() {
    it('should have a NoSuchElementError function', function() {
      expect(typeof SeleniumError.NoSuchElementError == 'function').toBe(true);
    });
    it('should have error codes', function() {
      expect(typeof SeleniumError.ErrorCode == 'object').toBe(true);
    });
    it('should have an error code of NO_SUCH_ALERT', function() {
      expect(typeof SeleniumError.ErrorCode.NO_SUCH_ALERT == 'number').toBe(true);
    });
  });
  describe('require("selenium-webdriver/remote")', function() {
    it('should have a SeleniumServer function', function() {
      expect(typeof Remote['SeleniumServer'] == 'function').toBe(true);
    });
  });
});
