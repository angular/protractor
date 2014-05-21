The Webdriver Control Flow
==========================

The WebDriverJS API is based on promises, which are managed by a control flow.
I highly recommend reading the [WebDriverJS documentation](https://code.google.com/p/selenium/wiki/WebDriverJs#Understanding_the_API)
on this topic. A short summary, and how Protractor interacts with the control
flow, is presented below.

Promises and the Control Flow
-----------------------------

WebDriverJS (and thus, Protractor) APIs are entirely asynchronous. All functions
return [promises](https://github.com/kriskowal/q). 

WebDriverJS maintains a queue of pending promises, called the control flow,
to keep execution organized. For example, consider the test

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
control flow is empty before exiting. This means you don't need to worry
about calling runs() and waitsFor() blocks. 

Jasmine expectations are also adapted to understand promises. That's why
the line

```javascript
  expect(name.getText()).toEqual('Jane Doe');
```

works - this code actually adds an expectation task to the control flow,
which will run after the other tasks.
