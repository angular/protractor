Page Objects
============

The Page Object pattern mentioned [here](https://github.com/angular/protractor/blob/master/docs/getting-started.md#organizing-real-tests-page-objects)
is an excellent pattern to use when working on your tests.

Here are some examples of some idioms that might be useful when trying to write Page Objects and corresponding tests.

Basic Page Object Inclusion
===========================

Most folks are not going to want to include their Page Object definitions in the same file, most sites are worked on
by numerous developers. For this reason we should split them up into separate files.

```javascript
var YourPageObject = function () {

    this.firstThingYourPageDoes = function() {
    }

    this.otherThingYourPageDoes = function() {
    }

    this.isThingDone = function() {
        return true; //something you may want to assert
    }

}
module.exports = YourPageObject;

```

Then when you want to use the new PageObject in your test you can just do something like this
`your-page-object.js` contains the contents of the YourPageObject above.

```javascript
var YourPageObject = require('./pageModels/your-page-object')

describe("Do the first thing and other thing", function () {

    var yourPageObject = new YourPageObject();

    it("Should let me do my first thing and other thing", function() {
        yourPageObject.firstThingYourPageDoes();
        yourPageObject.otherThingYourPageDoes();
        expect(yourPageObject.isThingDone())
    }
}

```


Idioms
======

This will hopefully turn into a comprehensive list of helpful idioms that will help other angular users when they are
trying to hook into objects within their application.

[Class Selector Access](./page-objects/class-selector-access.md)