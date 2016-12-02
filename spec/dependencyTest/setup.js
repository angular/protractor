// lib/webdriver.js exported via index.js
var WebDriver = require('selenium-webdriver').WebDriver;
var WebElement = require('selenium-webdriver').WebElement;

// lib/sessions.js
var Session = require('selenium-webdriver/lib/session').Session;

// executors.js
var Executor = require('selenium-webdriver/lib/command').Executor;

var session = '1234';
var seleniumAddress = 'http://localhost:4444/wd/hub';
var capabilities = {
  browserName: 'chrome'
};


var getExecutor = function() {
  return new Executor();
};

var getWebDriver = function() {
  return new WebDriver(session, getExecutor());
};

var getSession = function() {
  return new Session(session, capabilities);
};

var getWebElement = function() {
  return new WebElement(getWebDriver(), session);
};

module.exports = {
  getExecutor: getExecutor,
  getWebDriver: getWebDriver,
  getSession: getSession,
  getWebElement: getWebElement
};
