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

    it('should find an element by textarea model', function() {
      var about = ptor.findElement(protractor.By.textarea('aboutbox'));
      expect(about.getAttribute('value')).toEqual('This is a text box');

      about.clear();
      about.sendKeys('Something else to write about');

      expect(about.getAttribute('value')).
          toEqual('Something else to write about');
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

    it('should find multiple selects', function() {
      ptor.findElements(protractor.By.select('dc.color')).then(function(arr) {
        expect(arr.length).toEqual(3);
      });
    });

    it('should find multiple selected options', function() {
      ptor.findElements(protractor.By.selectedOption('dc.color')).then(function(arr) {
        expect(arr.length).toEqual(3);
        expect(arr[0].getText()).toBe('red');
        expect(arr[1].getText()).toBe('green');
        expect(arr[2].getText()).toBe('blue');
      });
    });

    describe('by repeater', function() {
      it('should find by partial match', function() {
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

      it('should return all rows when unmodified', function() {
        var all =
            ptor.findElements(protractor.By.repeater('dayColor in dayColors'));
        all.then(function(arr) {
          expect(arr.length).toEqual(3);
          expect(arr[0].getText()).toEqual('Mon red');
          expect(arr[1].getText()).toEqual('Tue green');
          expect(arr[2].getText()).toEqual('Wed blue');
        });
      });

      it('should return a single column', function() {
        var colors = ptor.findElements(
            protractor.By.repeater('dayColor in dayColors').column('color'));
        colors.then(function(arr) {
          expect(arr.length).toEqual(3);
          expect(arr[0].getText()).toEqual('red');
          expect(arr[1].getText()).toEqual('green');
          expect(arr[2].getText()).toEqual('blue');
        });
      });

      it('should return a single row', function() {
        var secondRow = ptor.findElement(
            protractor.By.repeater('dayColor in dayColors').row(2));
        expect(secondRow.getText()).toEqual('Tue green');
      });

      it('should return an individual cell', function() {
        var secondColor = ptor.findElement(
            protractor.By.repeater('dayColor in dayColors').
            row(2).
            column('color'));

        var secondColorByColumnFirst = ptor.findElement(
            protractor.By.repeater('dayColor in dayColors').
            column('color').
            row(2));

        expect(secondColor.getText()).toEqual('green');
        expect(secondColorByColumnFirst.getText()).toEqual('green');
      });

      it('should find a using data-ng-repeat', function() {
        var byRow =
          ptor.findElement(protractor.By.repeater('day in days').row(3));
        expect(byRow.getText()).toEqual('Wed');

        var byCol =
            ptor.findElement(protractor.By.repeater('day in days').row(3).
            column('day'));
        expect(byCol.getText()).toEqual('Wed');
      });

      it('should find using ng:repeat', function() {
        var byRow =
          ptor.findElement(protractor.By.repeater('bar in days').row(3));
        expect(byRow.getText()).toEqual('Wed');

        var byCol =
            ptor.findElement(protractor.By.repeater('bar in days').row(3).
            column('bar'));
        expect(byCol.getText()).toEqual('Wed');
      });

      it('should find using ng_repeat', function() {
        var byRow =
          ptor.findElement(protractor.By.repeater('foo in days').row(3));
        expect(byRow.getText()).toEqual('Wed');

        var byCol =
            ptor.findElement(protractor.By.repeater('foo in days').row(3).
            column('foo'));
        expect(byCol.getText()).toEqual('Wed');
      });

      it('should find using x-ng-repeat', function() {
        var byRow =
          ptor.findElement(protractor.By.repeater('qux in days').row(3));
        expect(byRow.getText()).toEqual('Wed');

        var byCol =
            ptor.findElement(protractor.By.repeater('qux in days').row(3).
            column('qux'));
        expect(byCol.getText()).toEqual('Wed');
      });
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

  describe('finding an element by css', function() {
    beforeEach(function() {
      ptor.get('app/index.html#/bindings');
    });

    describe('via the driver', function() {
      it('should return the same results as web driver', function() {
        ptor.findElement(protractor.By.css('.planet-info')).getText().then(function(textFromLongForm) {
          var textFromShortcut = ptor.$('.planet-info').getText();
          expect(textFromShortcut).toEqual(textFromLongForm);
        });
      });
    });

    describe('via a web element', function() {
      var select;

      beforeEach(function() {
        select = ptor.findElement(protractor.By.css('select'));
      });

      it('should return the same results as web driver', function() {
        select.findElement(protractor.By.css('option[value="4"]')).getText().then(function(textFromLongForm) {
          var textFromShortcut = select.$('option[value="4"]').getText();
          expect(textFromShortcut).toEqual(textFromLongForm);
        });
      });
    });
  });

  describe('finding elements by css', function() {
    beforeEach(function() {
      ptor.get('app/index.html#/bindings');
    });

    describe('via the driver', function() {
      it('should return the same results as web driver', function() {
        ptor.findElements(protractor.By.css('option')).then(function(optionsFromLongForm) {
          ptor.$$('option').then(function(optionsFromShortcut) {
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
        select = ptor.findElement(protractor.By.css('select'));
      });

      it('should return the same results as web driver', function() {
        select.findElements(protractor.By.css('option')).then(function(optionsFromLongForm) {
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
      ptor.get('app/index.html#/bindings');
    });

    describe('when found via #findElement', function() {
      describe('when using a locator that specifies an override', function() {
        it('should wrap the result', function() {
          ptor.findElement(protractor.By.binding('planet.name')).then(verifyMethodsAdded);
        });
      });

      describe('when using a locator that does not specify an override', function() {
        it('should wrap the result', function() {
          ptor.findElement(protractor.By.css('option[value="4"]')).then(verifyMethodsAdded);
        });
      });
    });

    describe('when found via #findElements', function() {
      describe('when using a locator that specifies an override', function() {
        it('should wrap the results', function() {
          ptor.findElements(protractor.By.binding('planet.name')).then(function(results) {
            results.forEach(verifyMethodsAdded);
          });
        });
      });

      describe('when using a locator that does not specify an override', function() {
        it('should wrap the results', function() {
          ptor.findElements(protractor.By.css('option[value="4"]')).then(function(results) {
            results.forEach(verifyMethodsAdded);
          });
        });
      });
    });

    describe('when querying against a found element', function() {
      var info;

      beforeEach(function() {
        info = ptor.findElement(protractor.By.css('.planet-info'));
      });

      describe('when found via #findElement', function() {
        describe('when using a locator that specifies an override', function() {
          it('should wrap the result', function() {
            info.findElement(protractor.By.binding('planet.name')).then(verifyMethodsAdded);
          });
        });

        describe('when using a locator that does not specify an override', function() {
          it('should wrap the result', function() {
            info.findElement(protractor.By.css('div:last-child')).then(verifyMethodsAdded);
          });
        });
      });

      describe('when querying for many elements', function() {
        describe('when using a locator that specifies an override', function() {
          it('should wrap the result', function() {
            info.findElements(protractor.By.binding('planet.name')).then(function(results) {
              results.forEach(verifyMethodsAdded);
            });
          });
        });

        describe('when using a locator that does not specify an override', function() {
          it('should wrap the result', function() {
            info.findElements(protractor.By.css('div:last-child')).then(function(results) {
              results.forEach(verifyMethodsAdded);
            });
          });
        });
      });
    });
  });
});
