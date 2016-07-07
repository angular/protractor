var WebDriver = require('selenium-webdriver').WebDriver;
var By = require('selenium-webdriver').By;
var Setup = require('./setup');
var Chrome = require('selenium-webdriver/chrome');
var Firefox = require('selenium-webdriver/firefox');
var Executors = require('selenium-webdriver/executors');
var SeleniumError = require('selenium-webdriver').error;
var Remote = require('selenium-webdriver/remote');
var Testing = require('selenium-webdriver/testing');

var WEBDRIVER = {
  staticFunctions: ['attachToSession', 'createSession'],
  instanceFunctions: ['actions', 'wait', 'sleep', 'getCurrentUrl', 'getTitle',
    'takeScreenshot', 'getSession', 'getCapabilities', 'quit', 'touchActions',
    'executeAsyncScript', 'call', 'wait', 'getWindowHandle',
    'getAllWindowHandles', 'getPageSource', 'close', 'get', 'findElement',
    'isElementPresent', 'findElements', 'manage', 'navigate', 'switchTo']
};
var WEBELEMENT = {
  instanceFunctions: ['getDriver', 'getId', 'getRawId',
    'findElement', 'click', 'sendKeys', 'getTagName', 'getCssValue',
    'getAttribute', 'getText', 'getSize', 'getLocation', 'isEnabled',
    'isSelected', 'submit', 'clear', 'isDisplayed', 'takeScreenshot']
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
var EXECUTORS = {
  staticFunction: 'createExecutor'
};
var TESTING = {
  staticFunctions: ['after', 'afterEach', 'before', 'beforeEach',
      'describe', 'it', 'iit']
};

describe('selenium-webdriver dependency', function() {
  describe('require("selenium-webdriver").WebDriver', function() {
    for (var pos1 in WEBDRIVER.staticFunctions) {
      var staticFunc = WEBDRIVER.staticFunctions[pos1];
      it('should have a ' + staticFunc + ' function', function() {
        expect(typeof WebDriver[staticFunc] == 'function').toBe(true);
      });
    }

    var webdriver = Setup.getWebDriver();
    for (var pos2 in WEBDRIVER.instanceFunctions) {
      var instanceFunc = WEBDRIVER.instanceFunctions[pos2];
      it('should have a ' + instanceFunc + ' function', function() {
        expect(typeof webdriver[instanceFunc] == 'function').toBe(true);
      });
    }
  });
  describe('require("selenium-webdriver").WebElement', function() {
    var webElement = Setup.getWebElement();
    for (var pos in WEBELEMENT.instanceFunctions) {
      var func = WEBELEMENT.instanceFunctions[pos];
      it('should have a ' + func + ' function', function() {
        expect(typeof webElement[func] == 'function').toBe(true);
      });
    }
  });
  describe('require("selenium-webdriver").By', function() {
    for (var pos in BY.staticFunctions) {
      var func = BY.staticFunctions[pos];
      it('should have a ' + func + ' function', function() {
        expect(typeof By[func] == 'function').toBe(true);
      });
    }
  });
  describe('require("selenium-webdriver").Session', function() {
    var session = Setup.getSession();
    for (var pos in SESSION.instanceFunctions) {
      var func = SESSION.instanceFunctions[pos];
      it('should have a ' + func + ' function', function() {
        expect(typeof session[func] == 'function').toBe(true);
      });
    }
  });
  describe('require("selenium-webdriver/chrome")', function() {
    for (var pos in CHROME.staticFunctions) {
      var func = CHROME.staticFunctions[pos];
      it('should have a ' + func + ' function', function() {
        expect(typeof Chrome[func] == 'function').toBe(true);
      });
    }
  });
  describe('require("selenium-webdriver/firefox")', function() {
    it('should have a ' + FIREFOX.staticFunction + ' function', function() {
      expect(typeof Firefox[FIREFOX.staticFunction] == 'function').toBe(true);
    });
  });
  describe('require("selenium-webdriver/executors")', function() {
    it('should have a ' + EXECUTORS.staticFunction + ' function', function() {
      expect(typeof Executors[EXECUTORS.staticFunction] == 'function').toBe(true);
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
  describe('require("selenium-webdriver/testing")', function() {
    for (var pos in TESTING.staticFunctions) {
      var func = TESTING.staticFunctions[pos];
      it('should have a ' + func + ' function', function() {
        expect(typeof Testing[func] == 'function').toBe(true);
      });
    }
  });
});
