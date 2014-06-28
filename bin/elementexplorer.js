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
var locatorFinder = require('../lib/locatorFinder.js');
var repl = require('repl');
var util = require('util');
var vm = require('vm');
var path = require('path');
var http = require('http');
var url = require('url');

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

/**
 * Open a server on port 13000 that will receive queries from the chrome
 * extension.
 */
var startServer = function() {

  var testSelector = function(flow, selector) {
    return flow.execute(function() {
      return vm.runInThisContext(selector, null);
    }).then(function(res) {
      return res;
    }, function(err) {
      return 'There was a webdriver error: ' + err.name + ' ' + err.message;
    });
  };

  http.createServer(function (request, response) {
    var flow = webdriver.promise.controlFlow(),
        parsedUrl = url.parse(request.url, true),
        locatorResults = {};

    // Is this a popup query or a devtools query?
    if (parsedUrl.query.popupInput) {
      var popupInput = parsedUrl.query.popupInput;

      console.log('Testing popup input', popupInput);

      // If the popup input starts with 'by' then execute a count expression.
      var expr = /^by/.test(popupInput) ?
          'element.all(' + popupInput + ').count()' : popupInput;

      locatorResults[expr] = testSelector(flow, expr);
    } else {
      var locators = JSON.parse(parsedUrl.query.locators),
          suggestionList = locatorFinder.buildLocatorList(locators);

      console.log('Testing locators', locators);
      console.log('Testing locator list', suggestionList);

      // Go through all the selectors and test them.
      suggestionList.forEach(function(suggestion) {
        locatorResults[suggestion.locator] =
            testSelector(flow, suggestion.countExpression);
      });
    }

    var sendResponse = function(results) {
      console.log('Sending locator results', results);
      response.writeHead(200,
          {'Content-Type': 'application/json; charset=utf-8'});
      response.end(JSON.stringify({
        results: results
      }));
    };

    // Does is have any locators to test?
    if (Object.keys(locatorResults).length) {
      webdriver.promise.fullyResolved(locatorResults).then(sendResponse);
    } else {
      sendResponse({log: 'Cannot find suggestions'});
    }
  }).listen(13000);
  console.log('Listening on port 13000');
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
    return webdriver.promise.fulfilled(result);
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
  // Resolve the path for the chrome extension.
  var extensionPath = path.resolve(__dirname, '../extension');

  driver = new webdriver.Builder().
      usingServer('http://localhost:4444/wd/hub').
      withCapabilities({
        'browserName': 'chrome',
        'chromeOptions': {
          'args': ['--load-extension=' + extensionPath]
        }
      }).build();

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


    util.puts('Type <tab> to see a list of locator strategies.');
    util.puts('Use the `list` helper function to find elements by strategy:');
    util.puts('  e.g., list(by.binding(\'\')) gets all bindings.');
    util.puts('');
    util.puts('IMPORTANT:');
    util.puts('The element explorer will not work when the dev tools window ' +
        'is open on the first tab of the launched chrome browser. To use the ' +
        'dev tools duplicate the first tab and inspect on the second tab.');
    util.puts('');

    var url = process.argv[2] || 'about:blank';
    util.puts('Getting page at: ' + url);
    driver.get(url);

    startServer();

    startRepl();
  });
};

startUp();
