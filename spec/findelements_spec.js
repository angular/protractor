var protractor = require('../lib/protractor.js');
var util = require('util');
require('../jasminewd');

describe('finding elements', function() {
  var ptor;

  describe('in forms', function() {
    ptor = protractor.getInstance();

    beforeEach(function() {
      ptor.get('app/index.html#/form');
    });

    it('should still do normal tests', function() {
      expect(true).toBe(true);
    });

    it('should find an element by binding', function() {
      ptor.findElement(protractor.By.binding('{{greeting}}')).
          getText().then(function(text) {
            expect(text).toEqual('Hiya');
          });
    });

    it('should find a binding by partial match', function() {
      ptor.findElement(protractor.By.binding('greet')).
          getText().then(function(text) {
            expect(text).toEqual('Hiya');
          });
    })

    it('should find an element by binding with attribute', function() {
      ptor.findElement(protractor.By.binding('username')).
          getText().then(function(text) {
            expect(text).toEqual('Anon');
          });
    });

    it('should find an element by text input model', function() {
      var username = ptor.findElement(protractor.By.input('username'));
      username.clear();
      username.sendKeys('Jane Doe');

      ptor.findElement(protractor.By.binding('username')).
          getText().then(function(text) {
            expect(text).toEqual('Jane Doe');
          });
    });

    it('should find an element by checkbox input model', function() {
      ptor.findElement(protractor.By.id('shower')).
          isDisplayed().then(function(displayed) {
            expect(displayed).toBe(true);
          });
      var colors = ptor.findElement(protractor.By.input('show')).
          click();
      ptor.findElement(protractor.By.id('shower')).
          isDisplayed().then(function(displayed) {
            expect(displayed).toBe(false);
          });
    });

    it('should find inputs with alternate attribute forms', function() {
      var letterList = ptor.findElement(protractor.By.id('letterlist'));
      letterList.getText().then(function(text) {
        expect(text).toBe('');
      });

      ptor.findElement(protractor.By.input('check.w')).click();
      letterList.getText().then(function(text) {
        expect(text).toBe('w');
      });

      ptor.findElement(protractor.By.input('check.x')).click();
      letterList.getText().then(function(text) {
        expect(text).toBe('wx');
      });

      ptor.findElement(protractor.By.input('check.y')).click();
      letterList.getText().then(function(text) {
        expect(text).toBe('wxy');
      });

      ptor.findElement(protractor.By.input('check.z')).click();
      letterList.getText().then(function(text) {
        expect(text).toBe('wxyz');
      });
    });

    it('should find a repeater by partial match', function() {
      ptor.findElement(
          protractor.By.repeater('baz in days | filter:\'T\'').
              row(1).column('{{baz}}')).
          getText().then(function(text) {
            expect(text).toEqual('Tue');
          });

      ptor.findElement(
          protractor.By.repeater('baz in days').row(1).column('b')).
          getText().then(function(text) {
            expect(text).toEqual('Tue');
          });

      ptor.findElement(
          protractor.By.repeater('baz in days').row(1)).
          getText().then(function(text) {
            expect(text).toEqual('Tue');
          });
    });

    it('should find a repeater using data-ng-repeat', function() {
      ptor.findElement(protractor.By.repeater('day in days').row(3)).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });

      ptor.findElement(protractor.By.repeater('day in days').row(3).
          column('day')).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
    });

    it('should find a repeater using ng:repeat', function() {
      ptor.findElement(protractor.By.repeater('bar in days').row(3)).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
      ptor.findElement(protractor.By.repeater('bar in days').row(3).
          column('bar')).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
    });

    it('should find a repeater using ng_repeat', function() {
      ptor.findElement(protractor.By.repeater('foo in days').row(3)).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
      ptor.findElement(protractor.By.repeater('foo in days').row(3).
          column('foo')).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
    });

    it('should find a repeater using x-ng-repeat', function() {
      ptor.findElement(protractor.By.repeater('qux in days').row(3)).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
      ptor.findElement(protractor.By.repeater('qux in days').row(3).
          column('qux')).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
    });
  });

  describe('further examples', function() {
    beforeEach(function() {
      ptor.get('app/index.html#/bindings');
    });

    it('should find elements using a select', function() {
      ptor.findElement(protractor.By.selectedOption('planet')).
          getText().then(function(text) {
            expect(text).toEqual('Mercury');
          });

      // There must be a better way to do this.
      ptor.findElement(protractor.By.select('planet'))
          .findElement(protractor.By.css('option[value="4"]')).click();

      ptor.findElement(protractor.By.selectedOption('planet')).
          getText().then(function(text) {
            expect(text).toEqual('Jupiter');
          });
    });

    it('should find elements using a repeater', function() {
      // Returns the element for the entire row.
      ptor.findElement(protractor.By.repeater('ball in planets').row(3)).
          getText().then(function(text) {
            expect(text).toEqual('Earth:3');
          });

      // Returns the element in row 2 and the column with binding {{ball.name}}
      ptor.findElement(protractor.By.repeater('ball in planets').row(2).
          column('{{ball.name}}'))
            .getText().then(function(text) {
              expect(text).toEqual('Venus');
            });

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
});
