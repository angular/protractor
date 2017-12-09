`async`/`await`
===============

**Background**

-   The Web Driver Control Flow is used to synchronize your commands so they reach
the browser in the correct order (see
[/docs/control-flow.md](/docs/control-flow.md) for details).  In the future, the
control flow is being removed (see [SeleniumHQ's github issue](
https://github.com/SeleniumHQ/selenium/issues/2969) for details). Instead of the
control flow, you can synchronize your commands with promise chaining or the
upcoming ES7 feature `async`/`await`.

-   Previously, we have Typescript support for `async`/`await`: Please see [TypeScript examples which use `async`/`await`](/exampleTypescript/asyncAwait/README.md).

-   The latest [Node.js](https://nodejs.org/en/) provides native async/await,
    which means we can get stable e2e test without using control flow in javascript test.

    **Note**: To write and run native async/await test, the node.js version should be greater than or equal to 8.0, and Jasmine version should be greater than or equal to 2.7

-   If we disable control flow and use async/await to write tests, we can get a
    better debugging experience by using [chrome
    inspector](/docs/debugging.md#disabled-control-flow)

**How to use native async/await in test**

We have a simple example to show how to use async/await in test.

You can find the whole example in
[here](/debugging/async_await.js)

```javascript
describe('angularjs homepage', function() {
  it('should greet the named user', async function() {
    await browser.get('http://www.angularjs.org');

    await element(by.model('yourName')).sendKeys('Julie');

    var greeting = element(by.binding('yourName'));

    expect(await greeting.getText()).toEqual('Hello Julie!');
  });
```

As you can see, the syntax is almost the same with TypeScript async/await.

1.  We need wrap our asynchronous function with “async”.
1.  We can add “await” keyword to each operation that we want our program to
    wait for.

    **Note:** Never forget to add “await” keyword in an async function, it
    may bring some unexpected problem (e.g. your test might fail silently and
    always be reported as passed).
1.  Don’t forget to turn off control_flow, you cannot use a mix of `async`/`await` and the control flow:
`async`/`await` causes the control flow to become unreliable (see
[github issue]( https://github.com/SeleniumHQ/selenium/issues/3037)).  So if you
`async`/`await` anywhere in a spec, you should use the
`SELENIUM_PROMISE_MANAGER: false`

```javascript
// An example configuration file for debugging test using async/await.
exports.config = {
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: ['async_await.js'],

  SELENIUM_PROMISE_MANAGER: false,

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
```
