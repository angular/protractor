FAQ
===

My tests time out in Protractor, but everything's working fine when running manually. What's up?
--------------------

Protractor attempts to wait until the page is completely loaded before
performing any action (such as finding an element or sending a command to
an element). If your application continuously polls $timeout or $http, it will
never be registered as completely loaded. You should use the
[$interval service](https://github.com/angular/angular.js/blob/master/src/ng/interval.js) for anything that polls continuously (introduced in Angular 1.2rc3). Further
discussion is in [issue 49](https://github.com/angular/protractor/issues/49).

You may also be running into a timeout because your page is slow to load
or perform actions. By default, Protractor sets the timeout for actions to
11 seconds. You can change this in your config with the `allScriptsTimeout`
options.
```javascript
  exports.config = {
    // Override the timeout for webdriver to 20 seconds.
    allScriptsTimeout: 20000,
  }
```

Check out the [debugging doc](https://github.com/angular/protractor/blob/master/docs/debugging.md#timeouts)
for more information.

Why both Karma and Protractor? When do I use which?
---------------------------------------------------

Karma is a great tool for unit testing, and Protractor is intended for
end to end or integration testing. This means that small tests for the logic
of your individual controllers, directives, and services should be run using
Karma. Big tests in which you have a running instance of your entire application
should be run using Protractor. Protractor is intended to run tests from a
user's point of view - if your test could be written down as instructions
for a human interacting with your application, it should be an end to end test
written with Protractor.

Here's a [great blog post](http://www.yearofmoo.com/2013/09/advanced-testing-and-debugging-in-angularjs.html)
with more info.

Angular can't be found on my page
---------------------------------

Protractor supports angular 1.0.6/1.1.4 and higher - check that your version of Angular is upgraded.

The `angular` variable is expected to be available in the global context. Try opening chrome devtools or firefox and see if `angular` is defined.

How do I deal with my log-in page?
----------------------------------

If your app needs log-in, there are a couple ways to deal with it. If your login
page is not written with Angular, you'll need to interact with it via 
unwrapped webdriver, which can be accessed like `browser.driver.get()`. 

You can put your log-in code into an `onPrepare` function, which will be run
once before any of your tests. See [this example](https://github.com/angular/protractor/blob/master/spec/login/login_spec.js).

The result of `getText` from an input element is always empty
-------------------------------------------------------------

This is a [webdriver quirk](http://grokbase.com/t/gg/webdriver/12bcmvwhcm/extarcting-text-from-the-input-field).
`<input>` and `<textarea>` elements always have
empty `getText` values. Instead, try `element.getAttribute('value')`.

How can I interact directly with the JavaScript running in my app?
------------------------------------------------------------------

In general, the design of WebDriver tests is to interact with the page as a user would, so it gets a little tricky if you want to interact with the JavaScript directly. You should avoid it unless you have a good reason. However, there are ways of doing it.

You can use the evaluate function on a WebElement to get the value of an Angular expression in the scope of that element. e.g.
```javascript
by.css('.foo').evaluate('bar')
```
would return whatever `{{bar}}` is in the scope of the element with class 'foo'.

You can also execute arbitrary JavaScript in the browser with
```javascript
browser.executeScript('your script as a string')
```

How can I get hold of the browser's console?
--------------------------------------------
In your test:
```javascript
browser.manage().logs().get('browser').then(function(browserLog) {
  console.log('log: ' + require('util').inspect(browserLog));
});
```

This will output logs from the browser console. Note that logs below the set logging level will be ignored. WebDriver does not currently support changing the logging level for browser logs.

How do I produce an XML report of my test results?
--------------------------------------------------

Use jasmine-reporters and add a JUnit XML Reporter. Check out [this example](https://github.com/angular/protractor/blob/master/spec/junitOutputConf.js).
