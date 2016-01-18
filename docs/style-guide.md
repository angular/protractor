Style Guide
===========

### Don't e2e test what’s been unit tested

**Why?**
* Unit tests are much faster than e2e tests
* Avoid duplicate tests

### Use one configuration file

**Why?**
* Use your build tool to set up different configurations
* Avoid duplicate configuration code

```shell
# Avoid

protractor.conf.local.js
protractor.conf.dev.js
protractor.conf.test.js
```

```javascript
 /* Recommended */

 /* protractor.conf.js */
 exclude: [],
 multiCapabilities: [{
   browserName: 'chrome',
   shardTestFiles: true,
   maxInstances: 3
 }],
 allScriptsTimeout: 11000,
 getPageTimeout: 10000,
 jasmineNodeOpts: {
   isVerbose: false,
   showColors: true,
   includeStackTrace: false,
   defaultTimeoutInterval: 40000
 }
```

# Project structure

### Group your e2e tests in a structure that makes sense to the structure of your project

**Why?**
* Finding your e2e related files should be intuitive and easy
* Makes the folder structure more readable
* Clearly separates e2e tests from unit tests

```
/* avoid */
|-- project-folder
  |-- app
    |-- css
    |-- img
    |-- partials
        home.html
        profile.html
        contacts.html
    |-- js
      |-- controllers
      |-- directives
      |-- services
      app.js
      ...
    index.html
  |-- test
    |-- unit
    |-- e2e
        home-page.js
        home-spec.js
        profile-page.js
        profile-spec.js
        contacts-page.js
        contacts-spec.js

/* recommended */
|-- project-folder
  |-- app
    |-- css
    |-- img
    |-- partials
        home.html
        profile.html
        contacts.html
    |-- js
      |-- controllers
      |-- directives
      |-- services
      app.js
      ...
    index.html
  |-- test
    |-- unit
    |-- e2e
      |-- page-objects
          home-page.js
          profile-page.js
          contacts-page.js
      home-spec.js
      profile-spec.js
      contacts-spec.js
```

# Page objects

Page Objects help you write cleaner tests by encapsulating information about
the elements on your application page. A page object can be reused across
multiple tests, and if the template of your application changes, you only need
to update the page object.

### Declare one page object per file

**Why?**
* Each page object should be defined in its own file.
* Why? Keeps code clean and makes things easy to find.

### Use a single module.exports at the end of the page object file

**Why?**
* Each page object should declare a single class. You only need to export one
  class.

```js
// avoid

var UserProfilePage = function() {};
var UserSettingsPage = function() {};

module.exports = UserPropertiesPage;
module.exports = UserSettingsPage;
```

```javascript
// recommended

/** @constructor */
var UserPropertiesPage = function() {};

module.exports = UserPropertiesPage;
```

* Why? One page object per file means there's only one class to export.

### Require all the modules at the top

* You should declare all the required modules at the top of your page object,
  test, or helper module.

```js
var UserPage = require('./user-properties.page');
var MenuPage = require('./menu.page');
var FooterPage = require('./footer.page');

describe('User properties page', function() {
    ...
});
```

* Why? The module dependencies should be clear and easy to find.

### Instantiate all page objects at the beginning of the test suite

* Create new instances of the page object at the top of your top-level describe.
* Use upper case for the constructor name; lowercase for the instance name.

```js
var UserPropertiesPage = require('./user-properties.page');
var MenuPage = require('./menu.page');
var FooterPage = require('./footer.page');

describe('User properties page', function() {
  var userProperties = new UserPropertiesPage();
  var menu = new MenuPage();
  var footer = new FooterPage();

  // specs
});
```

* Why? Separates dependencies from the test code.
* Why? Makes the dependencies available to all specs of the suite.


### Declare all the page object public elements in the constructor

* All the elements that will be visible to the test should be declared in the
  constructor.

```html
<form>
  Name: <input type="text" ng-model="ctrl.user.name">
  E-mail: <input type="text" ng-model="ctrl.user.email">
  <button id="save-button">Save</button>
</form>
```

```javascript
/** @constructor */
var UserPropertiesPage = function() {
  // List all public elements here.
  this.name = element(by.model('ctrl.user.name'));
  this.email = element(by.model('ctrl.user.email'));
  this.saveButton = $('#save-button');
};
```

* Why? The user of the page object should have quick access to the available
  elements on a page


### Declare page object functions for operations that require more than one step

```javascript
/**
 * Page object for the user properties view.
 * @constructor
 */
var UserPropertiesPage = function() {
  this.newPhoneButton = $('button.new-phone');

  /**
   * Encapsulate complex operations in a function.
   * @param {string} phone Phone number.
   * @param {string} contactType Phone type (work, home, etc.).
   */
  this.addContactPhone = function(phone, contactType) {
    this.newPhoneButton.click();
    $$('#phone-list .phone-row').first().then(function(row) {
      row.element(by.model('item.phoneNumber')).sendKeys(phone);
      row.element(by.model('item.contactType')).sendKeys(contactType);
    });
  };
};
```

* Why? Most elements are already exposed by the page object and can be used
  directly in the test.
* Why? Doing otherwise will not have any added value

### Avoid using expect() in page objects

* Don't make any assertions in your page objects.
* Why? It is the responsibility of the test to do all the assertions.
* Why? A reader of the test should be able to understand the behavior of the
  application by looking at the test only

### Add page object wrappers for directives, dialogs, and common elements

* Some directives render complex HTML or they change frequently. Avoid code
  duplication by writing wrappers to interact with complex directives.
* Dialogs or modals are frequently used across multiple views.
* When the directive changes you only need to change the wrapper once.

For example, the Protractor website has navigation bar with multiple dropdown
menus. Each menu has multiple options. A page object for the menu would look
like this:

```js
/**
 * Page object for Protractor website menu.
 * @constructor
 */
var MenuPage = function() {
  this.dropdown = function(dropdownName) {
    /**
     * Dropdown api. Used to click on an element under a dropdown.
     * @param {string} dropdownName
     * @return {{option: Function}}
     */
    var openDropdown = function() {
      element(by.css('.navbar-nav'))
          .element(by.linkText(dropdownName))
          .click();
    };

    return {
      /**
       * Get an option element under a dropdown.
       * @param {string} optionName
       * @return {ElementFinder}
       */
      option: function(optionName) {
        openDropdown();
        return element(by.css('.dropdown.open'))
            .element(by.linkText(optionName));
      }
    }
  };
};

module.exports = MenuPage;
```

```js
var Menu = require('./menu');

describe('protractor website', function() {

  var menu = new Menu();

  it('should navigate to API view', function() {
    browser.get('http://www.protractortest.org/#/');

    menu.dropdown('Reference').option('Protractor API').click();

    expect(browser.getCurrentUrl())
        .toBe('http://www.protractortest.org/#/api');
  });
});
```

* Why? When you have a large team and multiple e2e tests people tend to write
  their own custom locators for the same directives.

# Locators

### Favor protractor locator strategies when possible

* Prefer protractor-specific locators such as `by.model` and `by.binding`.
* These locators are usually specific, short, and easy to read.

```html
<ul class="red">
  <li>{{color.name}}</li>
  <li>{{color.shade}}</li>
  <li>{{color.code}}</li>
</ul>

<div class="details">
  <div class="personal">
    <input ng-model="person.name">
  </div>
</div>
```

```js
// avoid
var nameElement = element.all(by.css('.red li')).get(0);
var personName = element(by.css('.details .personal input'));

// recommended
var nameElement = element(by.binding('color.name'));
var personName = element(by.model('person.name'));
```

* Why? It is easier to write your locator
* Why? The code is less likely to change than other markup


### Avoid text locators for text that changes frequently

* Try to avoid text-based locators such as `by.linkText`, `by.buttonText`,
  `by.cssContainingText`.
* Why? Text for buttons, links, and labels tends to change over time. Minor text
  changes in your application should not break your tests.


# Tests

### Use Jasmine 2

* Use the latest version of Jasmine

* Why? You can use `beforeAll` and `afterAll`.
* Why? You can filter tests by name.

### Make your tests independent at least at the file level

* Protractor can run your tests in parallel when you enable sharding. The files
  are executed across different browsers as they become available.
* Make your tests independent at the file level because the order in which
  they run is not guaranteed and it's easier to run a test in isolation.

### Do not add logic to your test

* Avoid using if statements and for loops. When you add logic your test may
  pass without testing anything, or may run very slowly.
