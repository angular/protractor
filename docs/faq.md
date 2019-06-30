FAQ
===

My tests time out in Protractor, but everything's working fine when running manually. What's up?
--------------------

There are several ways that Protractor can time out - see the [Timeouts](/docs/timeouts.md)
reference for full documentation.

What's the difference between Karma and Protractor? When do I use which?
---------------------------------------------------

[Karma](http://karma-runner.github.io) is a great tool for unit testing, and Protractor is intended for
end-to-end or integration testing. This means that small tests for the logic
of your individual controllers, directives, and services should be run using
Karma. Big tests in which you have a running instance of your entire application
should be run using Protractor. Protractor is intended to run tests from a
user's point of view - if your test could be written down as instructions
for a human interacting with your application, it should be an end-to-end test
written with Protractor.

Here's a [great blog post](http://www.yearofmoo.com/2013/09/advanced-testing-and-debugging-in-angularjs.html)
with more info.

Angular can't be found on my page
---------------------------------

Protractor supports Angular and AngularJS 1.0.6/1.1.4 and higher - check that your version of Angular is upgraded.

For AngularJS apps, the `angular` variable is expected to be available in the global context. Try opening chrome devtools or firefox and see if `angular` is defined.

For Angular apps, you should see a global method `getAllAngularTestabilities`.

How do I deal with my log-in page?
----------------------------------

If your app needs log-in, there are a couple ways to deal with it. If your login
page is not written with Angular, you'll need to interact with it via 
unwrapped webdriver, which can be accessed like `browser.driver.get()`. You can also use
`browser.waitForAngularEnabled(false)` as explained [here](/docs/timeouts.md#how-to-disable-waiting-for-angular).

Another option is to put your log-in code into an `onPrepare` function, which will be run
once before any of your tests. See this example ([withLoginConf.js](https://github.com/angular/protractor/blob/master/spec/withLoginConf.js))

Which browsers are supported?
-----------------------------
The last two major versions of Chrome, Firefox, IE, and Safari. See details at [Setting Up the Browser](/docs/browser-setup.md) and [Browser Support](/docs/browser-support.md).

The result of `getText` from an input element is always empty
-------------------------------------------------------------

This is a [webdriver quirk](http://grokbase.com/t/gg/webdriver/12bcmvwhcm/extarcting-text-from-the-input-field).
`<input>` and `<textarea>` elements always have
empty `getText` values. Instead, try `element.getAttribute('value')`.

How can I drag and drop elements?
---------------------------------
You can specify a sequence of [actions](http://www.protractortest.org/#/api?view=webdriver.WebDriver.prototype.actions)
to drag an drop elements.  Note mouse actions do not work on Chrome with the HTML5 Drag and Drop API due to a known
[Chromedriver issue](https://bugs.chromium.org/p/chromedriver/issues/detail?id=841)


How can I interact directly with the JavaScript running in my app?
------------------------------------------------------------------

In general, the design of WebDriver tests is to interact with the page as a user would, so it gets a little tricky if you want to interact with the JavaScript directly. You should avoid it unless you have a good reason. However, there are ways of doing it.

You can use the `evaluate` function on a WebElement to get the value of an Angular expression in the scope of that element. e.g.
```javascript
element(by.css('.foo')).evaluate('bar')
```
would return whatever `{{bar}}` is in the scope of the element with class 'foo'.

You can also execute arbitrary JavaScript in the browser with:
```javascript
browser.executeScript('your script as a string');
```

You can also pass a regular JavaScript function into `executeScript()`, for example:

```javascript
function getAngularVersion() {
  return window.angular.version.full;
}

browser.executeScript(getAngularVersion).then(function (version) {
  console.log(version);
});
```

How can I get hold of the browser's console?
--------------------------------------------
In your test:
```javascript
browser.manage().logs().get('browser').then(function(browserLog) {
  console.log('log: ' + require('util').inspect(browserLog));
});
```

This will output logs from the browser console. Note that logs below the set logging level will be ignored. The default level is warnings and above. To change, add a `loggingPrefs` object to your capabilities, as described [in the DesiredCapabilities docs](https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities#loggingpreferences-json-object).

See an example ([spec.js](https://github.com/juliemr/protractor-demo/blob/master/howtos/browserlog/spec.js)) of using this API to fail tests if the console has errors.

How can I get screenshots of failures?
-------------------------------------------- 
First, this is how you can take a screenshot:
```javascript
browser.takeScreenshot().then(function(png) {
  var stream = fs.createWriteStream("/tmp/screenshot.png");
  stream.write(new Buffer(png, 'base64'));
  stream.end();
});
```

The method to take a screenshot automatically on failure would depend on the type of failure.
* For failures of entire specs (such as timeout or an expectation within the spec failed), you can add a reporter as below:

```javascript
// Note: this is using Jasmine 2 reporter syntax.
jasmine.getEnv().addReporter(new function() {
  this.specDone = function(result) {
    if (result.failedExpectations.length >0) {
      // take screenshot
    }
  };
});
```

Note, you can also choose to take a screenshot in `afterEach`. However, because Jasmine does not execute `afterEach` for timeouts, those would not produce screenshots
* For failures of individual expectations, you can override jasmine's addMatcherResult/addExpectationResult function as such:

```javascript
// Jasmine 2
var originalAddExpectationResult = jasmine.Spec.prototype.addExpectationResult;
jasmine.Spec.prototype.addExpectationResult = function() {
  if (!arguments[0]) {
    // take screenshot
    // this.description and arguments[1].message can be useful to constructing the filename.
  }
  return originalAddExpectationResult.apply(this, arguments);
};
```

[See an example of taking screenshot on spec failures](https://github.com/juliemr/protractor-demo/blob/master/howtos/screenshot/screenshotReporter.js).

How do I produce an XML report of my test results?
--------------------------------------------------

You can use the npm package jasmine-reporters@^2.0.0 and add a JUnit XML Reporter in the `onPrepare` block. This would look something like:

```
var jasmineReporters = require('jasmine-reporters');
jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
    consolidateAll: true,
    savePath: 'testresults',
    filePrefix: 'reportXMLoutput'
}));
```

How can I catch errors such as ElementNotFound?
-----------------------------------------------
WebDriver throws errors when commands cannot be completed - e.g. not being able to click on an element which is obscured by another element. If you need to retry these actions, try using [webdriverjs-retry](https://github.com/juliemr/webdriverjs-retry). If you would just like to catch the error, do so like this
```javascript
elm.click().then(function() { /* passing case */}, function(err) { /* error handling here */})
```

How can I test file uploads?
----------------------------
Via Webdriver, you can just send the absolute file path to the input with type=file. [See this example](http://stackoverflow.com/questions/21305298/how-to-upload-file-in-angularjs-e2e-protractor-testing/21314337#21314337).

If you need to test file upload on a remote server (such as Sauce Labs), [you need to set a remote file detector](https://saucelabs.com/resources/articles/selenium-file-upload). You can do this via `browser.setFileDetector()`, and you'll need access to the `selenium-webdriver` node module.

```js
var remote = require('selenium-webdriver/remote');
browser.setFileDetector(new remote.FileDetector());
```

I get an error: Page reload detected during async script. What does this mean?
------------------------------------------------------------------------------
This means that there was a navigation or reload event while a command was pending
on the browser. Usually, this is because a click action or navigation resulted
in a page load. Protractor is trying to wait for Angular to become stable,
but it's interrupted by the reload.

You may need to insert a `browser.wait` condition to make sure the load
is complete before continuing.

How do I switch off an option in the CLI?
-----------------------------------------
i.e. `webdriver-manager update --chrome=false` does not work. 
This has to do with the way `optimist` parses command line args. In order to pass a false value, do one of the following:

1) `webdriver-manager update --chrome=0`

2) `webdriver-manager update --no-chrome` (see https://github.com/substack/node-optimist#negate-fields)

Why does Protractor fail when I decorate $timeout?
--------------------------------------------------
Protractor tracks outstanding $timeouts by default, and reports them in the error message if Protractor fails to synchronize with Angular in time.

However, in order to do this Protractor needs to decorate $timeout. This means if your app decorates $timeout, you must turn off this behavior for Protractor. To do so pass in the 'untrackOutstandingTimeouts' flag. 

I still have a question
-----------------------

Please see our [Contributing Guidelines](https://github.com/angular/protractor/blob/master/CONTRIBUTING.md#questions) for questions and issues.
