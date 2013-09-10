var util = require('util');

describe('finding elements', function() {
  var ptor;

  describe('in forms', function() {
    ptor = protractor.getInstance();

    beforeEach(function() {
      ptor.get('app/index.html#/form');
    });

    it('should find an element by binding', function() {
      var greeting = ptor.findElement(protractor.By.binding('{{greeting}}'));

      expect(greeting.getText()).toEqual('Hiya');
    });

    it('should find a binding by partial match', function() {
      var greeting = ptor.findElement(protractor.By.binding('greet'));

      expect(greeting.getText()).toEqual('Hiya');
    });

    it('should find an element by binding with attribute', function() {
      var name = ptor.findElement(protractor.By.binding('username'));

      expect(name.getText()).toEqual('Anon');
    });

    it('should find an element by text input model', function() {
      var username = ptor.findElement(protractor.By.input('username'));
      username.clear();
      username.sendKeys('Jane Doe');

      var name = ptor.findElement(protractor.By.binding('username'));

      expect(name.getText()).toEqual('Jane Doe');
    });

    it('should find an element by checkbox input model', function() {
      expect(ptor.findElement(protractor.By.id('shower')).isDisplayed()).
          toBe(true);

      var colors = ptor.findElement(protractor.By.input('show')).click();

      expect(ptor.findElement(protractor.By.id('shower')).isDisplayed()).
          toBe(false);
    });

    it('should find inputs with alternate attribute forms', function() {
      var letterList = ptor.findElement(protractor.By.id('letterlist'));
      expect(letterList.getText()).toBe('');

      ptor.findElement(protractor.By.input('check.w')).click();
      expect(letterList.getText()).toBe('w');

      ptor.findElement(protractor.By.input('check.x')).click();
      expect(letterList.getText()).toBe('wx');

      ptor.findElement(protractor.By.input('check.y')).click();
      expect(letterList.getText()).toBe('wxy');

      ptor.findElement(protractor.By.input('check.z')).click();
      expect(letterList.getText()).toBe('wxyz');
    });

    it('should find multiple inputs', function() {
      ptor.findElements(protractor.By.input('color')).then(function(arr) {
        expect(arr.length).toEqual(3);
      });
    });

    it('should find a repeater by partial match', function() {
      var fullMatch = ptor.findElement(
          protractor.By.repeater('baz in days | filter:\'T\'').
              row(1).column('{{baz}}'));
      expect(fullMatch.getText()).toEqual('Tue');

      var partialMatch = ptor.findElement(
          protractor.By.repeater('baz in days').row(1).column('b'));
      expect(partialMatch.getText()).toEqual('Tue');

      var partialRowMatch = ptor.findElement(
          protractor.By.repeater('baz in days').row(1));
      expect(partialRowMatch.getText()).toEqual('Tue');
    });

    it('should find a repeater using data-ng-repeat', function() {
      var byRow =
        ptor.findElement(protractor.By.repeater('day in days').row(3));
      expect(byRow.getText()).toEqual('Wed');

      var byCol = 
          ptor.findElement(protractor.By.repeater('day in days').row(3).
          column('day'));
      expect(byCol.getText()).toEqual('Wed');
    });

    it('should find a repeater using ng:repeat', function() {
      var byRow =
        ptor.findElement(protractor.By.repeater('bar in days').row(3));
      expect(byRow.getText()).toEqual('Wed');

      var byCol = 
          ptor.findElement(protractor.By.repeater('bar in days').row(3).
          column('bar'));
      expect(byCol.getText()).toEqual('Wed');
    });

    it('should find a repeater using ng_repeat', function() {
      var byRow =
        ptor.findElement(protractor.By.repeater('foo in days').row(3));
      expect(byRow.getText()).toEqual('Wed');

      var byCol = 
          ptor.findElement(protractor.By.repeater('foo in days').row(3).
          column('foo'));
      expect(byCol.getText()).toEqual('Wed');
    });

    it('should find a repeater using x-ng-repeat', function() {
      var byRow =
        ptor.findElement(protractor.By.repeater('qux in days').row(3));
      expect(byRow.getText()).toEqual('Wed');

      var byCol = 
          ptor.findElement(protractor.By.repeater('qux in days').row(3).
          column('qux'));
      expect(byCol.getText()).toEqual('Wed');
    });

    it('should determine if an element is present', function() {
      expect(ptor.isElementPresent(protractor.By.binding('greet'))).toBe(true);
      expect(ptor.isElementPresent(protractor.By.binding('nopenopenope'))).
          toBe(false);
    });
  });

  describe('further examples', function() {
    beforeEach(function() {
      ptor.get('app/index.html#/bindings');
    });

    it('should find elements using a select', function() {
      expect(ptor.findElement(protractor.By.selectedOption('planet')).
          getText()).
          toEqual('Mercury');

      // There must be a better way to do this.
      ptor.findElement(protractor.By.select('planet'))
          .findElement(protractor.By.css('option[value="4"]')).click();

      expect(ptor.findElement(protractor.By.selectedOption('planet')).
          getText()).
          toEqual('Jupiter');
    });

    it('should find elements using a repeater', function() {
      // Returns the element for the entire row.
      expect(
          ptor.findElement(protractor.By.repeater('ball in planets').row(3)).
          getText()).toEqual('Earth:3');

      // Returns the element in row 2 and the column with binding {{ball.name}}
      expect(
          ptor.findElement(protractor.By.repeater('ball in planets').row(2).
          column('{{ball.name}}')).getText()).toEqual('Venus');

      // Returns the entire column.
      ptor.findElements(protractor.By.repeater('ball in planets').
          column('{{ball.name}}'))
            .then(function(arr) {
              arr[1].getText().then(function(text) {
                expect(text).toEqual('Venus');
              });
              arr[2].getText().then(function(text) {
                expect(text).toEqual('Earth');
              });
            });
    });

    it('should find multiple elements by binding', function() {
      // There must be a better way to do this.
      ptor.findElement(protractor.By.select('planet'))
          .findElement(protractor.By.css('option[value="4"]')).click();

      ptor.findElements(protractor.By.binding('{{moon}}'))
          .then(function(arr) {
            arr[0].getText().then(function(text) {
              expect(text).toEqual('Europa');
            });
            arr[2].getText().then(function(text) {
              expect(text).toEqual('Ganymede');
            })
          });
    });
  });

  describe('chaining findElements', function() {
    beforeEach(function() {
      ptor.get('app/index.html#/conflict');
    });

    it('should differentiate elements with the same binding by chaining',
      function() {
        expect(ptor.findElement(
          protractor.By.binding('item.reusedBinding')).getText()).
            toEqual('Outer: outer');

          expect(ptor.findElement(protractor.By.id('baz')).
              findElement(protractor.By.binding('item.resuedBinding')).
              getText()).
              toEqual('Inner: inner');
    });

    it('should find multiple elements scoped properly with chaining',
      function() {
        ptor.findElements(protractor.By.binding('item')).then(function(elems) {
          expect(elems.length).toEqual(4);
        });
        ptor.findElement(protractor.By.id('baz')).
            findElements(protractor.By.binding('item')).
            then(function(elems) {
              expect(elems.length).toEqual(2);
            });
      });

    it('should determine element presence properly with chaining', function() {
      expect(ptor.findElement(protractor.By.id('baz')).
          isElementPresent(protractor.By.binding('item.resuedBinding'))).
          toBe(true);

      expect(ptor.findElement(protractor.By.id('baz')).
        isElementPresent(protractor.By.binding('nopenopenope'))).
        toBe(false);
    })
  });

  describe('evaluating statements', function() {
    beforeEach(function() {
      ptor.get('app/index.html#/bindings');
    });

    it('should evaluate statements in the context of an element', function() {
      var element = ptor.findElement(protractor.By.binding('planet.name'));

      element.evaluate('planet.radius').then(function(output) {
        expect(output).toEqual(1516); // radius of Mercury.
      });

      // Make sure it works with a promise expectation.
      expect(element.evaluate('planet.radius')).toEqual(1516);
    });
  });
});
