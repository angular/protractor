#!/usr/bin/env node

/**
 * This is an explorer to help get the right element locators, and test out what
 * Protractor commands will do on your site without running a full test suite.
 *
 * This beta version only uses the Chrome browser.
 *
 * Usage:
 *
 * Expects a selenium standalone server to be running at http://localhost:4444
 * from protractor directory, run with:
 *
 *     ./bin/elementexplorer.js <urL>
 *
 * This will load up the URL on webdriver and put the terminal into a REPL loop.
 * You will see a > prompt. The `browser`, `element` and `protractor` variables
 * will be available. Enter a command such as:
 *
 *     > element(by.id('foobar')).getText()
 *
 * or
 *
 *     > browser.get('http://www.angularjs.org')
 *
 * try just
 *
 *     > browser
 *
 * to get a list of functions you can call.
 *
 * Typing tab at a blank prompt will fill in a suggestion for finding
 * elements.
 */

var webdriver = require('selenium-webdriver');
var protractor = require('../lib/protractor.js');
var repl = require('repl');
var util = require('util');
var vm = require('vm');

var driver, browser;

var INITIAL_SUGGESTIONS = [
  'element(by.id(\'\'))',
  'element(by.css(\'\'))',
  'element(by.name(\'\'))',
  'element(by.binding(\'\'))',
  'element(by.xpath(\'\'))',
  'element(by.tagName(\'\'))',
  'element(by.className(\'\'))'
];

var list = function(locator) {
  return browser.findElements(locator).then(function(arr) {
    var found = [];
    for (var i = 0; i < arr.length; ++i) {
      arr[i].getText().then(function(text) {
        found.push(text);
      });
    }
    return found;
  });
};

var highlight = function() {
  var locator = arguments[0];
  var timeFlashing = arguments[1];
  if (timeFlashing == undefined){ timeFlashing = 5;}

  var xPaths = [];
  var cssBorders = [];
  
  var getXPath = function(element){
    var xpath = '';
    for ( ; element && element.nodeType == 1; element = element.parentNode )
    {
        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
        id > 1 ? (id = '[' + id + ']') : (id = '');
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    return xpath;
  }
  
  var setElementBorder = function(xPath, borderValue)
  {
    var x = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE, null);
    var xx = x.iterateNext();
    xx.style.border = borderValue;
  }

  return browser.findElements(locator).then(function(arr) {
    for (var i = 0; i < arr.length; ++i) {
      driver.executeScript(getXPath, arr[i]).then(function(result){
        xPaths.push(result);
      });

      arr[i].getCssValue("border").then(function(val) {
        cssBorders.push(val);
			});
		}
		
		if(arr.length == 0) {
			return "No elements found.";
		}
	}).then(function() {
		var timesFlashed = timeFlashing*2;
		var waitTime = 500;
		
		for (var t = 0; t < timesFlashed; t++) {
			var borderValue = "5px inset rgb(256, 0, 0)";
			if (t%2 == 1) {
				borderValue = "5px inset rgb(256, 256, 0)";
			}
      
			for (var i = 0; i < xPaths.length; i++) {
				driver.executeScript(setElementBorder, xPaths[i], borderValue);	
			}
      
			driver.sleep(waitTime);
		}
	}).then(function() {
		for (var j = 0; j < cssBorders.length; j++) {
			driver.executeScript(setElementBorder, xPaths[j], borderValue);
		}
		
		return "Highlighting Completed.";
	});
};

var flowEval = function(code, context, file, callback) {

  var vmErr,
      result,
      flow = webdriver.promise.controlFlow();

  flow.execute(function() {
    try {
      result = vm.runInThisContext(code, file);
    } catch (e) {
      vmErr = e;
      callback(vmErr, null);
    }
    if (vmErr && process.domain) {
      process.domain.emit('error', vmErr);
      process.domain.exit();
    }

    if (webdriver.promise.isPromise(result)) {
      return result.then(function(val) {return val});
    } else {
      return result; 
    }
  }).then(function(res) {
    if (!vmErr) {
      callback(null, res);
    }
  }, function(err) {
    callback('There was a webdriver error: ' + err.name + ' ' + err.message,
        null);
  });
};

var startRepl = function() {
  var flowRepl = repl.start({
    'useGlobal': true,
    'eval': flowEval
  });

  var originalComplete = flowRepl.complete;

  flowRepl.complete = function(line, completeCallback) {
    if (line == '') {
      completeCallback(null, [INITIAL_SUGGESTIONS, '']);
    } else {
      originalComplete.apply(this, arguments);
    }
  };

  flowRepl.on('exit', function() {
    driver.quit();
    util.puts('Shutting down. Goodbye.');
  });
};

var startUp = function() {
  driver = new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities({'browserName': 'chrome'}).build();

  driver.getSession().then(function(session) {
    driver.manage().timeouts().setScriptTimeout(11000);

    browser = protractor.wrapDriver(driver);

    // Set up globals to be available from the command line.
    global.driver = driver;
    global.protractor = protractor;
    global.browser = browser;
    global.$ = browser.$;
    global.$$ = browser.$$;
    global.element = browser.element;
    global.by = global.By = protractor.By;
    global.list = list;
    global.highlight = highlight;

    util.puts('Type <tab> to see a list of locator strategies.');
    util.puts('Use the `list` helper function to find elements by strategy:');
    util.puts('  e.g., list(by.binding(\'\')) gets all bindings.');
    util.puts('');

    var url = process.argv[2] || 'about:blank';
    util.puts('Getting page at: ' + url);
    driver.get(url);

    startRepl();
  });
};

startUp();
