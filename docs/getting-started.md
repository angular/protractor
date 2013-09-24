Getting Started
===============

This guide describes how to get started writing Protractor tests.

WebDriverJS
-----------

When writing tests, it's important to remember that Protractor is a wrapper
around [WebDriverJS](https://code.google.com/p/selenium/wiki/WebDriverJs).
Selenium-Webdriver is a is a browser automation framework. Tests are written
with the WebDriver API, which communicates with a Selenium server to control
the browser under test.

When writing tests, keep the following in mind:

-  The test code and scripts running in the browser are separated, and only
   communicate through the [WebDriver wire protocol](https://code.google.com/p/selenium/wiki/JsonWireProtocol).
-  WebDriver commands are scheduled on a control flow and return promises, not
   primitive values. See the [control flow doc](/control-flow.md) for more
   info.
-  To run tests, WebDriverJS needs to talk to a selenium standalone server
   running as a separate process.

Setup and Run
-------------

Install Protractor with

    npm install -g protractor

(or omit the -g if you'd prefer not to install globally). 

The example test expects a selenium standalone server to be running at 
localhost:4444. Protractor comes with a script to help download and install
the standalone server. Run

    node_modules/protractor/bin/install_selenium_standalone

This installs selenium standalone server and chromedriver to `./selenium`. Start
the server with

    ./selenium/start

Protractor is now available as a command line program which takes one argument,
a configuration file. 

    protractor example/protractorConf.js

The configuration file tells Protractor what tests to run, how to connect to a
webdriver server, and various other options for reporting. See
[referenceConf.js](https://github.com/angular/protractor/blob/master/referenceConf.js)
for an example and explanation of the options. This simple configuration is

```javascript
// An example configuration file.
exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  specs: ['onProtractorRunner.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  }
};
```

Writing tests
-------------

By default, Protractor uses [Jasmine](http://pivotal.github.io/jasmine/) as its
test scaffolding. The `protractor` variable is exposed globally and can be used
to grab an instance of Protractor (which is called `ptor` in the docs). 

Take this example, which tests the 'Basics' example on the AngularJS homepage:

```javascript
describe('angularjs homepage', function() {
  var ptor;

  it('should greet using binding', function() {
    ptor = protractor.getInstance();

    // Load the AngularJS homepage.
    ptor.get('http://www.angularjs.org');

    // Find the element with ng-model matching 'yourName', and then
    // type 'Julie' into it.
    ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

    // Find the element with binding matching 'yourName' - this will
    // find the <h1>Hello {{yourName}}!</h1> element.
    var greeting = ptor.findElement(protractor.By.binding("yourName"));

    expect(greeting.getText()).toEqual('Hello Julie!');
  });
});
```

The `get` method loads a page. Protractor expects Angular to be present on a
page, so it will throw an error if the page it is attempting to load does
not containt he Angular library. (If you need to interact with a non-Angular
page, you may access the wrapped webdriver instance directly with
`ptor.driver`).

The `findElement` method searches for an element on the page. It requires one
parameter, a strategy for locating the element. Protractor offers Angular
specific strategies:

-  `protractor.By.binding` searches for elements by matching binding names,
   either from `ng-bind` or `{{}}` notation in the template.
-  `protractor.By.input` searches for elements by input `ng-model`.
-  `protractor.By.repeater` seraches for `ng-repeat` elements. For example,
   `protractor.By.repeater('phone in phones').row(12).column('price')` returns
   the element in the 12th row of the `ng-repeat = "phone in phones"` repeater
   with the binding matching `{{phone.price}}`.

You may also use plain old WebDriver strategies such as `protractor.By.id` and
`protractor.By.css`.

Once you have an element, you can interact with it with methods such as
`sendKeys`, `getText`, and `click`. I recommend referencing the
[WebDriverJS code](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js)
to find the latest and best documentation on these methods.

See Protractor's [findelements test suite](https://github.com/angular/protractor/blob/master/spec/findelements_spec.js)
for more examples.

Further Reading
---------------

- [WebDriverJS User's Guide](https://code.google.com/p/selenium/wiki/WebDriverJs)
- [WebDriver FAQ](https://code.google.com/p/selenium/wiki/FrequentlyAskedQuestions)
- [w3 WebDriver Working Draft](http://www.w3.org/TR/webdriver/)
