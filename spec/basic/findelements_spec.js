var util = require('util');

describe('locators', function() {
  beforeEach(function() {
    browser.get('app/index.html#/form');
  });

  describe('by binding', function() {
    it('should find an element by binding', function() {
      var greeting = element(by.binding('{{greeting}}'));

      expect(greeting.getText()).toEqual('Hiya');
    });

    it('should find a binding by partial match', function() {
      var greeting = element(by.binding('greet'));

      expect(greeting.getText()).toEqual('Hiya');
    });

    it('should find an element by binding with attribute', function() {
      var name = element(by.binding('username'));

      expect(name.getText()).toEqual('Anon');
    });
  });

  describe('by model', function() {
    it('should find an element by text input model', function() {
      var username = element(by.model('username'));
      username.clear();
      username.sendKeys('Jane Doe');

      var name = element(by.binding('username'));

      expect(name.getText()).toEqual('Jane Doe');
    });

    it('should find an element by checkbox input model', function() {
      expect(element(by.id('shower')).isDisplayed()).
          toBe(true);

      var colors = element(by.model('show')).click();

      expect(element(by.id('shower')).isDisplayed()).
          toBe(false);
    });

    it('should find an element by textarea model', function() {
      var about = element(by.textarea('aboutbox'));
      expect(about.getAttribute('value')).toEqual('This is a text box');

      about.clear();
      about.sendKeys('Something else to write about');

      expect(about.getAttribute('value')).
          toEqual('Something else to write about');
    });

    it('should find inputs with alternate attribute forms', function() {
      var letterList = element(by.id('letterlist'));
      expect(letterList.getText()).toBe('');

      element(by.model('check.w')).click();
      expect(letterList.getText()).toBe('w');

      element(by.model('check.x')).click();
      expect(letterList.getText()).toBe('wx');

      element(by.model('check.y')).click();
      expect(letterList.getText()).toBe('wxy');

      element(by.model('check.z')).click();
      expect(letterList.getText()).toBe('wxyz');
    });

    it('should find multiple inputs', function() {
      browser.findElements(by.model('color')).then(function(arr) {
        expect(arr.length).toEqual(3);
      });
    });

    it('should find multiple selects', function() {
      browser.findElements(by.select('dc.color')).then(function(arr) {
        expect(arr.length).toEqual(3);
      });
    });

    it('should find multiple selected options', function() {
      browser.findElements(by.selectedOption('dc.color')).then(function(arr) {
        expect(arr.length).toEqual(3);
        expect(arr[0].getText()).toBe('red');
        expect(arr[1].getText()).toBe('green');
        expect(arr[2].getText()).toBe('blue');
      });
    });
  });

  describe('by repeater', function() {
    it('should find by partial match', function() {
      var fullMatch = element(
          by.repeater('baz in days | filter:\'T\'').
              row(0).column('{{baz}}'));
      expect(fullMatch.getText()).toEqual('Tue');

      var partialMatch = element(
          by.repeater('baz in days').row(0).column('b'));
      expect(partialMatch.getText()).toEqual('Tue');

      var partialRowMatch = element(
          by.repeater('baz in days').row(0));
      expect(partialRowMatch.getText()).toEqual('Tue');
    });

    it('should return all rows when unmodified', function() {
      var all =
          browser.findElements(by.repeater('dayColor in dayColors'));
      all.then(function(arr) {
        expect(arr.length).toEqual(3);
        expect(arr[0].getText()).toEqual('Mon red');
        expect(arr[1].getText()).toEqual('Tue green');
        expect(arr[2].getText()).toEqual('Wed blue');
      });
    });

    it('should return a single column', function() {
      var colors = browser.findElements(
          by.repeater('dayColor in dayColors').column('color'));
      colors.then(function(arr) {
        expect(arr.length).toEqual(3);
        expect(arr[0].getText()).toEqual('red');
        expect(arr[1].getText()).toEqual('green');
        expect(arr[2].getText()).toEqual('blue');
      });
    });

    it('should return a single row', function() {
      var secondRow = element(
          by.repeater('dayColor in dayColors').row(1));
      expect(secondRow.getText()).toEqual('Tue green');
    });

    it('should return an individual cell', function() {
      var secondColor = element(
          by.repeater('dayColor in dayColors').
          row(1).
          column('color'));

      var secondColorByColumnFirst = element(
          by.repeater('dayColor in dayColors').
          column('color').
          row(1));

      expect(secondColor.getText()).toEqual('green');
      expect(secondColorByColumnFirst.getText()).toEqual('green');
    });

    it('should find a using data-ng-repeat', function() {
      var byRow =
        element(by.repeater('day in days').row(2));
      expect(byRow.getText()).toEqual('Wed');

      var byCol =
          element(by.repeater('day in days').row(2).
          column('day'));
      expect(byCol.getText()).toEqual('Wed');
    });

    it('should find using ng:repeat', function() {
      var byRow =
        element(by.repeater('bar in days').row(2));
      expect(byRow.getText()).toEqual('Wed');

      var byCol =
          element(by.repeater('bar in days').row(2).
          column('bar'));
      expect(byCol.getText()).toEqual('Wed');
    });

    it('should find using ng_repeat', function() {
      var byRow =
        element(by.repeater('foo in days').row(2));
      expect(byRow.getText()).toEqual('Wed');

      var byCol =
          element(by.repeater('foo in days').row(2).
          column('foo'));
      expect(byCol.getText()).toEqual('Wed');
    });

    it('should find using x-ng-repeat', function() {
      var byRow =
        element(by.repeater('qux in days').row(2));
      expect(byRow.getText()).toEqual('Wed');

      var byCol =
          element(by.repeater('qux in days').row(2).
          column('qux'));
      expect(byCol.getText()).toEqual('Wed');
    });
  });

  it('should determine if an element is present', function() {
    expect(browser.isElementPresent(by.binding('greet'))).toBe(true);
    expect(browser.isElementPresent(by.binding('nopenopenope'))).toBe(false);
  });
});

describe('chaining find elements', function() {
  beforeEach(function() {
    browser.get('app/index.html#/conflict');
  });

  it('should differentiate elements with the same binding by chaining',
    function() {
      expect(element(
        by.binding('item.reusedBinding')).getText()).
          toEqual('Outer: outer');

        expect(element(by.id('baz')).
            findElement(by.binding('item.resuedBinding')).
            getText()).
            toEqual('Inner: inner');
  });

  it('should find multiple elements scoped properly with chaining',
    function() {
      element.all(by.binding('item')).then(function(elems) {
        expect(elems.length).toEqual(4);
      });
      element(by.id('baz')).
          findElements(by.binding('item')).
          then(function(elems) {
            expect(elems.length).toEqual(2);
          });
    });

  it('should determine element presence properly with chaining', function() {
    expect(element(by.id('baz')).
        isElementPresent(by.binding('item.resuedBinding'))).
        toBe(true);

    expect(element(by.id('baz')).
      isElementPresent(by.binding('nopenopenope'))).
      toBe(false);
  })
});

describe('global element function', function() {
  it('should return the same result as browser.findElement', function() {
    browser.get('app/index.html#/form');
    var nameByElement = element(by.binding('username'));
    expect(nameByElement.getText()).toEqual(
        browser.findElement(by.binding('username')).getText());
  });

  it('should wait to grab the WebElement until a method is called', function() {
    browser.driver.get('about:blank');

    // These should throw no error before a page is loaded.
    var usernameInput = element(by.model('username'));
    var name = element(by.binding('username'));

    browser.get('app/index.html#/form');

    expect(name.getText()).toEqual('Anon');

    usernameInput.clear();
    usernameInput.sendKeys('Jane');
    expect(name.getText()).toEqual('Jane');
  });

  it('should count all elements', function() {
    browser.get('app/index.html#/form');

    element.all(by.model('color')).count().then(function(num) {
      expect(num).toEqual(3);
    });

    // Should also work with promise expect unwrapping
    expect(element.all(by.model('color')).count()).toEqual(3);
  });

  it('should get an element from an array', function() {
    var colorList = element.all(by.binding('dayColor.color'));

    browser.get('app/index.html#/form');

    expect(colorList.get(0).getText()).toEqual('red');
    expect(colorList.get(1).getText()).toEqual('green');
    expect(colorList.get(2).getText()).toEqual('blue');
  });

  it('should export an isPresent helper', function() {
    expect(element(by.binding('greet')).isPresent()).toBe(true);
    expect(element(by.binding('nopenopenope')).isPresent()).toBe(false);
  });
});

describe('evaluating statements', function() {
  beforeEach(function() {
    browser.get('app/index.html#/bindings');
  });

  it('should evaluate statements in the context of an element', function() {
    var firstPlanet = element(by.binding('planet.name'));

    firstPlanet.evaluate('planet.radius').then(function(output) {
      expect(output).toEqual(1516); // radius of Mercury.
    });

    // Make sure it works with a promise expectation.
    expect(firstPlanet.evaluate('planet.radius')).toEqual(1516);
  });
});

describe('shortcut css notation', function() {
  beforeEach(function() {
    browser.get('app/index.html#/bindings');
  });

  describe('via the driver', function() {
    it('should return the same results as web driver', function() {
      element(by.css('.planet-info')).getText().then(function(textFromLongForm) {
        var textFromShortcut = $('.planet-info').getText();
        expect(textFromShortcut).toEqual(textFromLongForm);
      });
    });

    it('should return the same array results as web driver', function() {
      element.all(by.css('option')).then(function(optionsFromLongForm) {
        $$('option').then(function(optionsFromShortcut) {
          expect(optionsFromShortcut.length).toEqual(optionsFromLongForm.length);

          optionsFromLongForm.forEach(function(option, i) {
            option.getText().then(function(textFromLongForm) {
              expect(optionsFromShortcut[i].getText()).toEqual(textFromLongForm);
            });
          });
        });
      });
    });
  });

  describe('via a web element', function() {
    var select;

    beforeEach(function() {
      select = element(by.css('select'));
    });

    it('should return the same results as web driver', function() {
      select.findElement(by.css('option[value="4"]')).getText().then(function(textFromLongForm) {
        var textFromShortcut = select.$('option[value="4"]').getText();
        expect(textFromShortcut).toEqual(textFromLongForm);
      });
    });

    it('should return the same array results as web driver', function() {
      select.findElements(by.css('option')).then(function(optionsFromLongForm) {
        select.$$('option').then(function(optionsFromShortcut) {
          expect(optionsFromShortcut.length).toEqual(optionsFromLongForm.length);

          optionsFromLongForm.forEach(function(option, i) {
            option.getText().then(function(textFromLongForm) {
              expect(optionsFromShortcut[i].getText()).toEqual(textFromLongForm);
            });
          });
        });
      });
    });
  });
});

describe('wrapping web driver elements', function() {
  var verifyMethodsAdded = function(result) {
    expect(typeof result.evaluate).toBe('function');
    expect(typeof result.$).toBe('function');
    expect(typeof result.$$).toBe('function');
  }

  beforeEach(function() {
    browser.get('app/index.html#/bindings');
  });

  describe('when found via #findElement', function() {
    describe('when using a locator that specifies an override', function() {
      it('should wrap the result', function() {
        browser.findElement(by.binding('planet.name')).then(verifyMethodsAdded);
      });
    });

    describe('when using a locator that does not specify an override', function() {
      it('should wrap the result', function() {
        browser.findElement(by.css('option[value="4"]')).then(verifyMethodsAdded);
      });
    });
  });

  describe('when found via #findElements', function() {
    describe('when using a locator that specifies an override', function() {
      it('should wrap the results', function() {
        browser.findElements(by.binding('planet.name')).then(function(results) {
          results.forEach(verifyMethodsAdded);
        });
      });
    });

    describe('when using a locator that does not specify an override', function() {
      it('should wrap the results', function() {
        browser.findElements(by.css('option[value="4"]')).then(function(results) {
          results.forEach(verifyMethodsAdded);
        });
      });
    });
  });

  describe('when querying against a found element', function() {
    var info;

    beforeEach(function() {
      info = browser.findElement(by.css('.planet-info'));
    });

    describe('when found via #findElement', function() {
      describe('when using a locator that specifies an override', function() {
        it('should wrap the result', function() {
          info.findElement(by.binding('planet.name')).then(verifyMethodsAdded);
        });
      });

      describe('when using a locator that does not specify an override', function() {
        it('should wrap the result', function() {
          info.findElement(by.css('div:last-child')).then(verifyMethodsAdded);
        });
      });
    });

    describe('when querying for many elements', function() {
      describe('when using a locator that specifies an override', function() {
        it('should wrap the result', function() {
          info.findElements(by.binding('planet.name')).then(function(results) {
            results.forEach(verifyMethodsAdded);
          });
        });
      });

      describe('when using a locator that does not specify an override', function() {
        it('should wrap the result', function() {
          info.findElements(by.css('div:last-child')).then(function(results) {
            results.forEach(verifyMethodsAdded);
          });
        });
      });
    });
  });
});
