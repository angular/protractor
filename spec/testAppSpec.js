var webptor = require('selenium-webdriver');
var protractor = require('../lib/protractor.js');
var util = require('util');

var catchPromiseErrors = function(done) {
  webptor.promise.controlFlow().
    on('uncaughtException', function(e) {
        done(e);
    });
};

var originalIt = it;

it = function(desc, testFn) {
  originalIt(desc, function(done) {
    catchPromiseErrors(done);
    testFn(done);
  });
}

describe('test application', function() {
  var ptor = protractor.getInstance();

  describe('finding elements in forms', function() {
    beforeEach(function() {
      ptor.get('http://localhost:8000/app/index.html#/form');
    });

    it('should find an element by binding', function(done) {
      // $('{{greeting}}')
      // $('form.foo > input{{greeting}}')
      // $('ul > *{{student in students}}*')
      // $('ul').repeater('student in students')
      // $('button#submit')

      ptor.findElement(protractor.By.binding('{{greeting}}')).
          getText().then(function(text) {
            expect(text).toEqual('Hiya');
            done();
          });
    });

    it('should find a binding by partial match', function(done) {
      ptor.findElement(protractor.By.binding('greet')).
          getText().then(function(text) {
            expect(text).toEqual('Hiya');
            done();
          });
    })

    it('should find an element by binding with attribute', function(done) {
      ptor.findElement(protractor.By.binding('username')).
          getText().then(function(text) {
            expect(text).toEqual('Anon');
            done();
          });
    });

    it('should find an element by text input model', function(done) {
      var username = ptor.findElement(protractor.By.input('username'));
      username.clear();
      username.sendKeys('Jane Doe');

      ptor.findElement(protractor.By.binding('username')).
          getText().then(function(text) {
            expect(text).toEqual('Jane Doe');
            done();
          });
    });

    it('should find an element by checkbox input model', function(done) {
      ptor.findElement(protractor.By.id('shower')).
          isDisplayed().then(function(displayed) {
            expect(displayed).toBe(true);
          });
      var colors = ptor.findElement(protractor.By.input('show')).
          click();
      ptor.findElement(protractor.By.id('shower')).
          isDisplayed().then(function(displayed) {
            expect(displayed).toBe(false);
            done();
          });
    });

    it('should find inputs with alternate attribute forms', function(done) {
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
        done();
      });
    });

    it('should find a repeater by partial match', function(done) {
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
            done();
          });
    });

    it('should find a repeater using data-ng-repeat', function(done) {
      ptor.findElement(protractor.By.repeater('day in days').row(3)).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });

      ptor.findElement(protractor.By.repeater('day in days').row(3).
          column('day')).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
            done();
          });
    });

    it('should find a repeater using ng:repeat', function(done) {
      ptor.findElement(protractor.By.repeater('bar in days').row(3)).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
      ptor.findElement(protractor.By.repeater('bar in days').row(3).
          column('bar')).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
            done();
          });
    });

    it('should find a repeater using ng_repeat', function(done) {
      ptor.findElement(protractor.By.repeater('foo in days').row(3)).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
      ptor.findElement(protractor.By.repeater('foo in days').row(3).
          column('foo')).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
            done();
          });
    });

    it('should find a repeater using x-ng-repeat', function(done) {
      ptor.findElement(protractor.By.repeater('qux in days').row(3)).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
          });
      ptor.findElement(protractor.By.repeater('qux in days').row(3).
          column('qux')).
          getText().then(function(text) {
            expect(text).toEqual('Wed');
            done();
          });
    });
  });

  describe('finding elements - further examples', function() {
    beforeEach(function() {
      ptor.get('http://localhost:8000/app/index.html#/bindings');
    });

    it('should find elements using a select', function(done) {
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
            done();
          });
    });

    it('should find elements using a repeater', function(done) {
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
                done();
              });
            });
    });

    it('should find multiple elements by binding', function(done) {
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
              done();
            })
          });
    });
  });

  describe('mock modules', function() {
    // A module to override the 'version' service. This function will be
    // executd in the context of the application under test, so it may
    // not refer to any local variables.
    var mockModuleA = function() {
      var newModule = angular.module('moduleA', []);
      newModule.value('version', '2');
    };

    // A second module overriding the 'version' service. 
    // This module shows the use of a string for the load
    // function.
    // TODO(julie): Consider this syntax. Should we allow loading the
    // modules from files? Provide helpers?
    var mockModuleB = "angular.module('moduleB', []).value('version', '3');";

    afterEach(function() {
      ptor.clearMockModules();
    });

    it('should override services via mock modules', function(done) {
      ptor.addMockModule('moduleA', mockModuleA);

      ptor.get('http://localhost:8000/app/index.html');

      ptor.findElement(protractor.By.css('[app-version]')).
          getText().then(function(text) {
            expect(text).toEqual('2');
            done();
          });
    });

    it('should have the version of the last loaded module', function(done) {
      ptor.addMockModule('moduleA', mockModuleA);
      ptor.addMockModule('moduleB', mockModuleB);

      ptor.get('http://localhost:8000/app/index.html');

      ptor.findElement(protractor.By.css('[app-version]')).
          getText().then(function(text) {
            expect(text).toEqual('3');
            done();
          });
    });
  });

  describe('synchronizing with Angular', function() {
    describe('http calls', function() {
      beforeEach(function() {
        ptor.get('http://localhost:8000/app/index.html');
      });

      it('should wait for slow RPCs', function(done) {
        var sample1Button = ptor.findElement(protractor.By.id('sample1'));
        var sample2Button = ptor.findElement(protractor.By.id('sample2'));
        sample1Button.click();

        var fetchButton = ptor.findElement(protractor.By.id('fetch'));
        fetchButton.click();

        // The quick RPC works fine.
        var status = ptor.findElement(protractor.By.binding('{{status}}'));
        status.getText().then(function(text) {
          expect(text).toEqual('200');
        });
        ptor.findElement(protractor.By.binding("{{data}}")).
            getText().then(function(text) {
              expect(text).toEqual('done');
            });

        // Slow RPC.
        sample2Button.click();
        fetchButton.click();
        // Would normally need ptor.sleep(2) or something.
        ptor.findElement(protractor.By.id('statuscode')).
            getText().then(function(text) {
              expect(text).toEqual('200');
            });
        ptor.findElement(protractor.By.id('data')).getText().
            then(function(text) {
              expect(text).toEqual('finally done');
              done();
            });
      });
    });

    describe('slow rendering', function() {
      beforeEach(function() {
        ptor.get('http://localhost:8000/app/index.html#/repeater');
      });

      it('should synchronize with a slow action', function(done) {
        var addOneButton = ptor.findElement(protractor.By.id('addone'));
        addOneButton.click();
        ptor.findElement(
            protractor.By.repeater("foo in foos | orderBy:'a':true").row(1).
            column('{{foo.b}}')).getText().then(function(text) {
              expect(text).toEqual('14930352');
            });
        addOneButton.click();
        ptor.findElement(
            protractor.By.repeater("foo in foos | orderBy:'a':true").row(1).
            column('{{foo.b}}')).getText().then(function(text) {
              expect(text).toEqual('24157817');
              done();
            });
      });
    })
  });
});
