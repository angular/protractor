Overview
========

You may want to begin with [the tutorial](/docs/tutorial.md) for a step-by-step way to get started with Protractor.

Protractor is an end-to-end test framework for AngularJS applications. Selenium Webdriver is a browser automation framework. Protractor tests are written on top of the Selenium WebDriver API (WebDriverJS) and run in conjunction with the Selenium Server and the Selenium WebDriver Browser Drivers. Your test, the server, and the browser all run as separate processes.

```
[Test Code] <--> [Selenium Server] <--> [Browser with Browser Driver]
```

When writing tests, keep the following in mind: 
 - Protractor is a wrapper around WebDriverJS, the JavaScript bindings for the Selenium WebDriver API (skim through the [WebDriverJS Users Guide](https://code.google.com/p/selenium/wiki/WebDriverJs) before writing your test).
 - WebDriver commands are scheduled on a control flow and return promises, not primitive values. See The [WebDriver Control Flow](/docs/control-flow.md) doc for more info.
 - Communication between the Selenium Server and the Browser Drivers is managed by the [JSON WebDriver Wire Protocol](https://code.google.com/p/selenium/wiki/JsonWireProtocol). All actions that you can perform in your test must be done through this protocol.

Protractor needs two files to run: a configuration file and the test (spec) file.

Configuration
----------------

The configuration file tells Protractor what tests to run, how to connect to a
Selenium Server, and which browser to use. See
[referenceConf.js](/docs/referenceConf.js)
for an example and explanation of all the configuration options. 

A simple configuration is shown below.

```javascript
// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to the configuration file location passed
  // to proractor (in this example conf.js).
  // They may include glob patterns.
  specs: ['example-spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  }
};
```

Writing tests
-------------

By default, Protractor uses [Jasmine](http://pivotal.github.io/jasmine/) as its
test scaffolding. (If you'd prefer to use a different framework, such as Mocha,
see [Frameworks](/docs/frameworks.md)) Protractor exposes several global variables.

 * `browser` this is the a wrapper around an instance of webdriver. Used for
 navigation and page-wide information.

 * `element` is a helper function for finding and interacting with HTML elements
 on the page you are testing.

 * `by` is a collection of element locator strategies. For example, elements
 can be found by CSS selector, by ID, or by the attribute they are bound to with
 ng-model.

 * `protractor` is the protractor namespace which wraps the webdriver namespace.
 This contains static variables and classes, such as `protractor.Key` which
 enumerates the codes for special keyboard signals.

A simple spec file tests the 'The Basics' example on the AngularJS homepage:

```javascript
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    // Load the AngularJS homepage.
    browser.get('http://www.angularjs.org');

    // Find the element with ng-model matching 'yourName' - this will
    // find the <input type="text" ng-model="yourName"/> element - and then
    // type 'Julie' into it.
    element(by.model('yourName')).sendKeys('Julie');

    // Find the element with binding matching 'yourName' - this will
    // find the <h1>Hello {{yourName}}!</h1> element.
    var greeting = element(by.binding('yourName'));

    // Assert that the text element has the expected value.
    // Protractor patches 'expect' to understand promises.
    expect(greeting.getText()).toEqual('Hello Julie!');
  });
});

```

The `browser.get` method loads a page. Protractor expects Angular to be present on a page, so it will throw an error if the page it is attempting to load does
not contain the Angular library. (If you need to interact with a non-Angular
page, you may access the wrapped webdriver instance directly with
`browser.driver`).

The `element` method searches for an element on the page. It requires one
parameter, a *locator* strategy for locating the element. Protractor offers Angular specific strategies:

-  `by.binding` searches for elements by matching binding names,
   either from `ng-bind` or `{{}}` notation in the template.
-  `by.model` searches for elements by input `ng-model`.
-  `by.repeater` searches for `ng-repeat` elements. For example,
   `by.repeater('phone in phones').row(11).column('price')` returns
   the element in the 12th row (0-based) of the `ng-repeat = "phone in phones"` repeater
   with the binding matching `{{phone.price}}`.

You may also use plain old WebDriver strategies such as `by.id` and
`by.css`. Since locating by CSS selector is so common, the global variable `$` is an alias for `element.by.css`. See [Using Locators](/docs/locators.md) for more information.

`element` returns an ElementFinder. This is an object which allows you to interact with the element on your page, but since all interaction with the browser must be done over webdriver, it is important to remember that this is *not* a DOM element. You can interact with it with methods such as
`sendKeys`, `getText`, and `click`. Check out the [API](/docs/api.md) for a list of
all available methods.

See Protractor's [findelements test suite](https://github.com/angular/protractor/blob/master/spec/basic/elements_spec.js)
for more examples.


Setting up the System Under Test
--------------------------------

Protractor uses real browsers to run its tests, so it can connect to anything that your browser can connect to. This means you have great flexibility in deciding _what_ you are actually testing. It could be a development server on localhost, a staging server up on your local network, or even production servers on the general internet. All Protractor needs is the URL.

There are a couple of things to watch out for!

**If your page does manual bootstrap** Protractor will not be able to load your page using `browser.get`. Instead, use the base webdriver instance - `browser.driver.get`. This means that Protractor does not know when your page is fully loaded, and you may need to add a wait statement to make sure your tests avoid race conditions.

**If your page uses $timeout for polling** Protractor will not be able to tell when your page is ready. Consider using $interval instead of $timeout and see [this issue](https://github.com/angular/protractor/issues/49) for further discussion.

If you need to do global preparation for your tests (for example, logging in), you can put this into the config in the `onPrepare` property. This property can be either a function or a filename. If a filename, Protractor will load that file with node.js and run its contents. See the [login tests](https://github.com/angular/protractor/blob/master/spec/login) for an example.


Further Reading
---------------

- [WebDriverJS User's Guide](https://code.google.com/p/selenium/wiki/WebDriverJs)
- [WebDriver FAQ](https://code.google.com/p/selenium/wiki/FrequentlyAskedQuestions)
- [w3 WebDriver Working Draft](http://www.w3.org/TR/webdriver/)
- [Step-by-step slides on Protractor](http://ramonvictor.github.io/protractor/slides/) (May 3, 2014)
- [Introduction to Protractor](https://docs.google.com/file/d/0BwDWzYJ-4RpAQnNRLXM3QVFPMjg) (May 21, 2014)
