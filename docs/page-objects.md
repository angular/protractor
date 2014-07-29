Organizing Tests: Page Objects
-----------------------------------

When writing test scripts for the pages of your application, it's best to use the [Page Objects](https://code.google.com/p/selenium/wiki/PageObjects) pattern to organize and make your tests more readable. 

In Protractor, this could look like:

```javascript
var AngularHomepage = function() {
  this.nameInput = element(by.model('yourName'));
  this.greeting = element(by.binding('yourName'));

  this.get = function() {
    browser.get('http://www.angularjs.org');
  };

  this.setName = function(name) {
    this.nameInput.sendKeys(name);
  };
};
```

Your test then becomes:

```javascript
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    var angularHomepage = new AngularHomepage();
    angularHomepage.get();

    angularHomepage.setName('Julie');

    expect(angularHomepage.greeting.getText()).toEqual('Hello Julie!');
  });
});
```

It is possible to separate your tests in various test suites. The configuration becomes:

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

You can then easily switch from the command line between running one or the other suite of tests. This will only run the homepage section of the tests:

    protractor protractor.conf.js --suite homepage
