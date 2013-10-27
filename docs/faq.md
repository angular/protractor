FAQ
===

My tests time out in Protractor, but everything's working fine when running manually. What's up?
--------------------

Protractor attempts to wait until the page is completely loaded before
performing any action (such as finding an element or sending a command to
an element). If your application continuously polls $timeout or $http, it will
never be registered as completely loaded. You should use the
[$interval service](https://github.com/angular/angular.js/blob/master/src/ng/interval.js) for anything that polls continuously (introduced in Angular 1.2rc3). Further
discussion is in [issue 59](https://github.com/angular/protractor/issues/49).

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
end to end or intergration testing. This means that small tests for the logic
of your individual controllers, directives, and services should be run using
Karma. Big tests in which you have a running instance of your entire application
should be run using Protractor. Protractor is intended to run tests from a
user's point of view - if your test could be written down as instructions
for a human interacting with your application, it should be an end to end test
written with Protractor.

Here's a [great blog post](http://www.yearofmoo.com/2013/09/advanced-testing-and-debugging-in-angularjs.html)
with more info.

How do I deal with my log-in page?
----------------------------------

If your app needs log-in, there are a couple ways to deal with it. If your login
page is not written with Angular, you'll need to interact with it via 
unwrapped webdriver, which can be accessed like `browser.driver.get()`. 

You can put your log-in code into an `onPrepare` function, which will be run
once before any of your tests. See [this example](https://github.com/angular/protractor/blob/master/spec/login/viaConfigConf.js).

If you would like to do your login in your test suite itself, see
[this example](https://github.com/angular/protractor/blob/master/spec/login/viaTestSpec.js).

The result of `getText` from an input element is always empty
-------------------------------------------------------------

This is a [webdriver quirk](http://grokbase.com/t/gg/webdriver/12bcmvwhcm/extarcting-text-from-the-input-field).
`<input>` and `<textarea>` elements always have
empty `getText` values. Instead, try `element.getAttribute('value')`.
