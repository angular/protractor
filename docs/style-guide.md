Protractor style guide
======================

This style guide was originally created by
[Carmen Popoviciu](https://github.com/CarmenPopoviciu) and 
[Andres Dominguez](https://github.com/andresdominguez). It is based on Carmen's 
Protractor 
[style guide](https://github.com/CarmenPopoviciu/protractor-styleguide) and 
Google's Protractor style guide.

## Video

Carmen and Andres gave a talk about this style guide at 
[AngularConnect](http://angularconnect.com/) in London. Here's the video in 
case you want to watch it.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=-lTGnYwnEuM" 
  target="_blank"><img src="http://img.youtube.com/vi/-lTGnYwnEuM/0.jpg" 
  alt="Protractor styleguide @AngularConnect" width="240" height="180" 
  border="10"/></a>

## Table of contents

* [Test suites](#test-suites)
* [Locator strategies](#locator-strategies)
* [Page objects](#page-objects)
* [Project structure](#project-structure)

# Test suites

### Don't e2e test what’s been unit tested

**Why?**
* Unit tests are much faster than e2e tests
* Avoid duplicate tests

### Make your tests independent at least at the file level

* Protractor can run your tests in parallel when you enable sharding. The files
  are executed across different browsers as they become available.
* Make your tests independent at the file level because the order in which
  they run is not guaranteed and it's easier to run a test in isolation.

### Do not add logic to your test

* Avoid using if statements and for loops. When you add logic your test may
  pass without testing anything, or may run very slowly.

### Don't mock unless you need to

This rule is a bit controversial, in the sense that opinions are very divided 
when it comes to what the best practice is. Some developers argue that e2e 
tests should use mocks for everything in order to avoid external network calls 
and have a second set of integration tests to test the APIs and database. Other 
developers argue that e2e tests should operate on the entire system and be as 
close to the 'real deal' as possible.

**Why?**
* Using the real application with all the dependencies gives you high confidence
* Helps you spot some corner cases you might have overlooked

### Use Jasmine2

**Why?**
* Jasmine is well documented
* It is supported by Protractor out of the box
* You can use `beforeAll` and `afterAll`

### Make your tests independent from each other

This rule holds true unless the operations performed to initialize the state of 
the tests are too expensive. For example, if your e2e tests would require that 
you create a new user before each spec is executed, you might end up with too 
high test run times. However, this does not mean you should make tests directly 
depend on one another. So, instead of creating a user in one of your tests and 
expect that record to be there for all other subsequent tests, you could harvest 
the power of jasmine's beforeAll (since Jasmine 2.1) to create the user.

```javascript
/* avoid */

it('should create user', function() {
   browser.get('#/user-list');
   userList.newButton.click();

   userProperties.name.sendKeys('Teddy B');
   userProperties.saveButton.click();

   browser.get('#/user-list');
   userList.search('Teddy B');
   expect(userList.getNames()).toEqual(['Teddy B']);
});

it('should update user', function() {
   browser.get('#/user-list');
   userList.clickOn('Teddy B');

   userProperties.name.clear().sendKeys('Teddy C');
   userProperties.saveButton.click();

   browser.get('#/user-list');
   userList.search('Teddy C');
   expect(userList.getNames()).toEqual(['Teddy C']);
});
```

```javascript
/* recommended */

describe('when the user Teddy B is created', function(){

  beforeAll(function() { 
    browser.get('#/user-list'); 
    userList.newButton.click(); 
    
    userProperties.name.sendKeys('Teddy B'); 
    userProperties.saveButton.click(); 
    browser.get('#/user-list'); 
  });

  it('should exist', function() { 
    userList.search('Teddy B'); 
    expect(userList.getNames()).toEqual(['Teddy B']); 
    userList.clear(); 
  });

  describe('and gets updated to Teddy C', function() {
    beforeAll(function() { 
      userList.clickOn('Teddy B'); 
      userProperties.name.clear().sendKeys('Teddy C'); 
      userProperties.saveButton.click(); 
      
      browser.get('#/user-list'); 
    }); 
    
    it('should be Teddy C', function() { 
      userList.search('Teddy C'); 
      expect(userList.getNames()).toEqual(['Teddy C']); 
      userList.clear(); 
    }); 
  });
});
```

**Why?**
* You can run tests in parallel with sharding
* The execution order is not guaranteed
* You can run suites in isolation
* You can debug your tests (ddescribe/fdescribe/xdescribe/iit/fit/xit)

### Navigate to the page under test before each test

**Why?**
* Assures you that the page under test is in a clean state

### Have a suite that navigates through the major routes of the app

**Why?**
* Makes sure the major parts of the application are correctly connected
* Users usually don’t navigate by manually entering urls 
* Gives confidence about permissions

# Locator strategies

### NEVER use xpath

**Why?**
* It's the slowest and most brittle locator strategy of all
* Markup is very easily subject to change and therefore xpath locators require
  a lot of maintenance
* xpath expressions are unreadable and very hard to debug

```javascript
/* avoid */

var elem = element(by.xpath('/*/p[2]/b[2]/following-sibling::node()' +
 '[count(.|/*/p[2]/b[2]/following-sibling::br[1]/preceding-sibling::node())' +
 '=' +
 ' count((/*/p[2]/b[2]/following-sibling::br[1]/preceding-sibling::node()))' +
 ']'));
```

### Prefer protractor locator strategies when possible

* Prefer protractor-specific locators such as `by.model` and `by.binding`.

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
/* avoid */

var nameElement = element.all(by.css('.red li')).get(0);
var personName = element(by.css('.details .personal input'));

/* recommended */

var nameElement = element(by.binding('color.name'));
var personName = element(by.model('person.name'));
```

**Why?**
* These locators are usually specific, short, and easy to read.
* It is easier to write your locator
* The code is less likely to change than other markup

### Prefer by.id and by.css when no Protractor locators are available

**Why?**
* Both are very performant and readable locators
* Access elements easier

### Avoid text locators for text that changes frequently

* Try to avoid text-based locators such as `by.linkText`, `by.buttonText`,
  `by.cssContainingText`.

**Why?**
* Text for buttons, links, and labels tends to change over time
* Your tests should not break when you make minor text changes

# Page objects

Page Objects help you write cleaner tests by encapsulating information about
the elements on your application page. A page object can be reused across
multiple tests, and if the template of your application changes, you only need
to update the page object.

### Use Page Objects to interact with page under test

**Why?**
* Encapsulate information about the elements on the page under test
* They can be reused across multiple tests
* Decouple the test logic from implementation details

```javascript
/* avoid */

/* question-spec.js */
describe('Question page', function() {
  it('should answer any question', function() {
    var question = element(by.model('question.text'));
    var answer = element(by.binding('answer'));
    var button = element(by.css('.question-button'));

    question.sendKeys('What is the purpose of life?');
    button.click();
    expect(answer.getText()).toEqual("Chocolate!");
  });
});
```

```javascript
/* recommended */

/* question-spec.js */
var QuestionPage = require('./question-page');

describe('Question page', function() {
  var question = new QuestionPage();

  it('should ask any question', function() {
    question.ask('What is the purpose of meaning?');
    expect(question.answer.getText()).toEqual('Chocolate');
  });
});

/* recommended */

/* question-page.js */
var QuestionPage = function() {
  this.question = element(by.model('question.text'));
  this.answer = element(by.binding('answer'));
  this.button = element(by.className('question-button'));

  this.ask = function(question) {
    this.question.sendKeys(question);
    this.button.click();
  };
};

module.exports = QuestionPage;
```

### Declare one page object per file

**Why?**
* Each page object should be defined in its own file.
* Why? Keeps code clean and makes things easy to find.

### Use a single module.exports at the end of the page object file

**Why?**
* Each page object should declare a single class. You only need to export one
  class.

```js
/* avoid */

var UserProfilePage = function() {};
var UserSettingsPage = function() {};

module.exports = UserPropertiesPage;
module.exports = UserSettingsPage;
```

```javascript
/* recommended */

/** @constructor */
var UserPropertiesPage = function() {};

module.exports = UserPropertiesPage;
```

* Why? One page object per file means there's only one class to export.

### Require all the modules at the top

* You should declare all the required modules at the top of your page object,
  test, or helper module.

```js
var UserPage = require('./user-properties-page');
var MenuPage = require('./menu-page');
var FooterPage = require('./footer-page');

describe('User properties page', function() {
    ...
});
```

**Why?**
* The module dependencies should be clear and easy to find.

### Instantiate all page objects at the beginning of the test suite

* Create new instances of the page object at the top of your top-level describe.
* Use upper case for the constructor name; lowercase for the instance name.

```js
var UserPropertiesPage = require('./user-properties-page');
var MenuPage = require('./menu-page');
var FooterPage = require('./footer-page');

describe('User properties page', function() {
  var userProperties = new UserPropertiesPage();
  var menu = new MenuPage();
  var footer = new FooterPage();

  // specs
});
```

**Why?**
* Separates dependencies from the test code.
* Makes the dependencies available to all specs of the suite.


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

**Why?**
* The user of the page object should have quick access to the available
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

**Why?**
* Most elements are already exposed by the page object and can be used
  directly in the test.
* Doing otherwise will not have any added value

### Avoid using expect() in page objects

* Don't make any assertions in your page objects.

**Why?**
* It is the responsibility of the test to do all the assertions.
* A reader of the test should be able to understand the behavior of the
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

**Why?**
* When you have a large team and multiple e2e tests people tend to write
  their own custom locators for the same directives.

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
