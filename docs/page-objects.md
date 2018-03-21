Using Page Objects to Organize Tests
====================================

When writing end-to-end tests, a common pattern is to use [Page Objects](https://github.com/SeleniumHQ/selenium/wiki/PageObjects). Page Objects help you write cleaner tests by encapsulating information about the elements on your application page. A Page Object can be reused across multiple tests, and if the template of your application changes, you only need to update the Page Object.

Without Page Objects
--------------------

Here’s a simple test script ([example_spec.js](/example/example_spec.js)) for ‘The Basics’ example on the [angularjs.org](http://www.angularjs.org) homepage.

```js
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    browser.get('http://www.angularjs.org');
    element(by.model('yourName')).sendKeys('Julie');
    var greeting = element(by.binding('yourName'));
    expect(greeting.getText()).toEqual('Hello Julie!');
  });
});
```

With Page Objects
----------------

To switch to Page Objects, the first thing you need to do is create a Page Object. A Page Object for ‘The Basics’ example on the angularjs.org homepage could look like this:

```js
var AngularHomepage = function() {
  var nameInput = element(by.model('yourName'));
  var greeting = element(by.binding('yourName'));

  this.get = function() {
    browser.get('http://www.angularjs.org');
  };

  this.setName = function(name) {
    nameInput.sendKeys(name);
  };

  this.getGreetingText = function() {
    return greeting.getText();
  };
};
module.exports = new AngularHomepage();
```

Or, if using `async / await`, something like this: (Note that functions
that don't use `await` shouldn't have the `async` prefix.)

```js
var AngularHomepage = function() {
  var nameInput = element(by.model('yourName'));
  var greeting = element(by.binding('yourName'));

  this.get = async function() {
    await browser.get('http://www.angularjs.org');
  };

  this.setName = async function(name) {
    await nameInput.sendKeys(name);
  };

  this.getGreetingText = function() {
    return greeting.getText();
  };

  // Not async, returns the element
  this.getGreeting = function() {
    return greeting;
  };
};
module.exports = new AngularHomepage();
```

The next thing you need to do is modify the test script to use the Page Object and its properties. Note that the _functionality_ of the test script itself does not change (nothing is added or deleted).

In the test script, you'll `require` the Page Object as presented above. The path to the Page Object _will be relative_ to your spec, so adjust accordingly.

```js
var angularHomepage = require('./AngularHomepage');
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    angularHomepage.get();

    angularHomepage.setName('Julie');

    expect(angularHomepage.getGreetingText()).toEqual('Hello Julie!');
  });
});
```

If using `async / await`, that would turn into something like:

```js
var angularHomepage = require('./AngularHomepage');
describe('angularjs homepage', function() {
  it('should greet the named user', async function() {
    await angularHomepage.get();

    await angularHomepage.setName('Julie');

    expect(await angularHomepage.getGreetingText()).toEqual('Hello Julie!');
  });
});
```

Configuring Test Suites
-----------------------

It is possible to separate your tests into various test suites. In your config file, you could setup the suites option as shown below:

```js
exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  suites: {
    homepage: 'tests/e2e/homepage/**/*Spec.js',
    search: ['tests/e2e/contact_search/**/*Spec.js',
      'tests/e2e/venue_search/**/*Spec.js']
  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  }
};
```

From the command line, you can then easily switch between running one or the other suite of tests. This command will run only the homepage section of the tests:

    protractor protractor.conf.js --suite homepage

Additionally, you can run specific suites of tests with the command:

    protractor protractor.conf.js --suite homepage,search
