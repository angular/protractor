Debugging Protractor Tests
==========================

End to end tests can be difficult to debug because they depend on an entire
system, may depend on prior actions (such as log-in), and may change the
state of the application they're testing. Webdriver tests in particular
can be difficult to debug because long error messages and the separation
between the browser and the process running the test. This document contains
advice on what to look for and how Protractor can help.

Types of failure
----------------

Protractor comes with [examples of failing tests](https://github.com/angular/protractor/blob/master/debugging/failure_spec.js).
To run, start up the test application and a selenium server, and run

```
protractor debugging/failure_conf.js
```

then look at all the pretty stack traces!

This test suite shows various types of failure:
-  Webdriver throws an error. When a command cannot be completed, for example
   an element is not found, webdriver throws an error.
-  Protractor will fail when it cannot find the Angular library on a page.
   If your test needs to interact with a non-angular page, access the webdriver
   instance directly with `ptor.driver`.
-  An expectation failure. This shows what a normal expectation failure looks
   like.

Pausing to debug
----------------

Protractor allows you to pause your test at any point and interact with the
browser. To do this insert `ptor.debugger();` into your test where you wish
to break.

```javascript
ptor = protractor.getInstance();

it('should fail to find a non-existent element', function() {
  ptor.get('app/index.html#/form');

  // Run this statement before the line which fails. If protractor is run
  // with the debugger (protractor debug debugging/conf.js), the test
  // will pause after loading the webpage but before trying to find the
  // element.
  ptor.debugger();

  // This element doesn't exist, so this fails.
  var nonExistant = ptor.findElement(protractor.By.binding('nopenopenope'));
});
```

Then run the test in debug mode

```
protractor debug debugging/failure_conf.js
```

This uses the [node debugger](http://nodejs.org/api/debugger.html). Enter
`c` to start execution and continue after the breakpoint.

We use `ptor.debugger();` instead of node's `debugger;` statement so that
the test pauses after the get command has been *executed*. Using `debugger;`
pauses the test after the get command is *scheduled* but has not yet
been sent to the browser.

Protractor's `debugger` method works by scheduling a node debug breakpoint
on the control flow.

When `debugger()` is called, it also inserts all the client side scripts
from Protractor into the browser as `window.clientSideScripts`. They can be
used from the browser's console.

```javascript
// In the browser console
> window.clientSideScripts.findInput('user.name');
// Should return the input element with model 'user.name'.
```

Taking Screenshots
------------------

Webdriver can snap a screenshot with `WebDriver.prototype.takeScreenshot()`.
This returns a promise which will resolve to the screenshot as a base-64
encoded PNG.

Timeouts
--------

Protractor also contains an example suite of tests which time out. Run with

```
protractor debugging/timeout_conf.js
```

Jasmine tests have a timeout which can be set
- By setting `jasmineNodeOpts.defaultTimeoutInterval` in the config, or
- By setting `jasmine.getEnv().defaultTimeoutInterval = myNumber;` in your test,
  or
- By adding a third parameter, timeout in ms, to your spec
  `it('should pass', function() {...}, 5555);`

Webdriver has a timeout for script execution, which can be set with
`driver.manage().timeouts().setScriptTimeout`. Protractor sets this to 11
seconds by default.

Protractor attempts to synchronize with your page before performing actions.
This means waiting for all $timeout or $http requests to resolve, as well as
letting the current $digest cycle finish. If your page has not synchronized
within the script execution timeout, Protractor will fail with the message
'Timed out waiting for Protractor to synchronize with the page'.

If your website uses $timeout or $http to continuously poll, Protractor will
interpret that as your site being busy and will time out on all requests. See
[this issue](https://github.com/angular/protractor/issues/49) for more
information.
