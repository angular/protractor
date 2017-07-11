The WebDriver Control Flow
==========================

The [WebDriverJS API](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs#understanding_the_api) is based on [promises](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs#promises),
which are managed by a [control flow](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs#control-flows)
and adapted for [Jasmine](http://jasmine.github.io/2.3/introduction.html).
A short summary about how Protractor interacts with the control flow is presented below.

Disabling the Control Flow
--------------------------

In the future, the control flow is being removed (see
[SeleniumHQ's github issue](https://github.com/SeleniumHQ/selenium/issues/2969)
for details).  To disable the control flow in your tests, you can use the
`SELENIUM_PROMISE_MANAGER: false` [config option](/lib/config.ts#L644).

Instead of the control flow, you can synchronize your commands
with promise chaining or the upcoming ES7 feature `async`/`await`.  See
[`/spec/ts/`](/spec/ts/) for examples of tests with the control flow disabled.

Because `async`/`await` uses native promises, it will make the Control Flow
unreliable.  As such, if you're writing a library or plugin which needs to work
whether or not the Control Flow is enabled, you'll need to handle
synchronization using promise chaining.

Promises and the Control Flow
-----------------------------

WebDriverJS (and thus, Protractor) APIs are entirely asynchronous. All functions
return promises.

WebDriverJS maintains a queue of pending promises, called the control flow,
to keep execution organized. For example, consider this test:

```javascript
  it('should find an element by text input model', function() {
    browser.get('app/index.html#/form');

    var username = element(by.model('username'));
    username.clear();
    username.sendKeys('Jane Doe');

    var name = element(by.binding('username'));

    expect(name.getText()).toEqual('Jane Doe');

    // Point A
  });
```

At Point A, none of the tasks have executed yet. The `browser.get` call is at
the front of the control flow queue, and the `name.getText()` call is at the
back. The value of `name.getText()` at point A is an unresolved promise
object.


Protractor Adaptations
----------------------

Protractor adapts Jasmine so that each spec automatically waits until the
control flow is empty before exiting.

Jasmine expectations are also adapted to understand promises. That's why this
line works - the code actually adds an expectation task to the control flow,
which will run after the other tasks:

```javascript
  expect(name.getText()).toEqual('Jane Doe');
```

Mocha Users
-----------

If you are using Mocha as your test framework, the control flow will still
automatically empty itself before each test completes. However, the `expect`
function in Mocha is _not_ adapted to understand promises - that's why you'll
need to use an assertion framework such as Chai as Promised. See
[Choosing a Framework](/docs/frameworks.md) for more information.
