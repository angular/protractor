var webdriver = require('selenium-webdriver');
var protractor = require('../lib/protractor.js');
var util = require('util');
require('../jasminewd');

describe('test application', function() {
  var ptor;

  describe('no ptor at all', function() {
    it('should still do normal tests', function() {
      expect(true).toBe(true);
    });
  });

  describe('finding elements in forms', function() {
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

  describe('finding elements - further examples', function() {
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

    it('should override services via mock modules', function() {
      ptor.addMockModule('moduleA', mockModuleA);

      ptor.get('app/index.html');

      ptor.findElement(protractor.By.css('[app-version]')).
          getText().then(function(text) {
            expect(text).toEqual('2');
          });
    });

    it('should have the version of the last loaded module', function() {
      ptor.addMockModule('moduleA', mockModuleA);
      ptor.addMockModule('moduleB', mockModuleB);

      ptor.get('app/index.html');

      ptor.findElement(protractor.By.css('[app-version]')).
          getText().then(function(text) {
            expect(text).toEqual('3');
          });
    });
  });

  describe('synchronizing with Angular', function() {
    describe('http calls', function() {
      beforeEach(function() {
        ptor.get('app/index.html');
      });

      it('should wait for slow RPCs', function() {
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
            });
      });
    });

    describe('slow rendering', function() {
      beforeEach(function() {
        ptor.get('app/index.html#/repeater');
      });

      it('should synchronize with a slow action', function() {
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
            });
      });
    });
  });
});

describe('protractor library', function() {
  var ptor = protractor.getInstance();

  it('should wrap webdriver', function() {
    ptor.get('app/index.html');
    ptor.getTitle().then(function(title) {
      expect(title).toEqual('My AngularJS App');
    });
  });

  it('should allow a mix of using protractor and using the driver directly',
    function() {
      ptor.get('app/index.html');
      ptor.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:8000/app/index.html#/http')
      });
      ptor.driver.findElement(protractor.By.linkText('repeater')).click();
      ptor.driver.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:8000/app/index.html#/repeater');
      });
      ptor.navigate().back();
      ptor.driver.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:8000/app/index.html#/http');
      });
    });
});

describe('synchronizing with slow pages', function() {
  var ptor = protractor.getInstance();

  beforeEach(function() {
    ptor.get('app/index.html#/async');
  });

  it('waits for http calls', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowHttpStatus'));
    var button = ptor.findElement(protractor.By.css('[ng-click="slowHttp()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();
    ptor.waitForAngular();

    expect(status.getText()).toEqual('done');
  });

  it('waits for long javascript execution', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowFunctionStatus'));
    var button =
      ptor.findElement(protractor.By.css('[ng-click="slowFunction()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();
    ptor.waitForAngular();

    expect(status.getText()).toEqual('done');
  });

  it('DOES NOT wait for timeout', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowTimeoutStatus'));
    var button =
      ptor.findElement(protractor.By.css('[ng-click="slowTimeout()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();
    ptor.waitForAngular();

    expect(status.getText()).toEqual('pending...');
  });

  it('waits for $timeout', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowAngularTimeoutStatus'));
    var button =
      ptor.findElement(protractor.By.css('[ng-click="slowAngularTimeout()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();
    ptor.waitForAngular();

    expect(status.getText()).toEqual('done');
  });

  it('waits for $timeout then a promise', function() {
    var status =
      ptor.findElement(protractor.By.binding(
          'slowAngularTimeoutPromiseStatus'));
    var button =
      ptor.findElement(protractor.By.css(
          '[ng-click="slowAngularTimeoutPromise()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();
    ptor.waitForAngular();

    expect(status.getText()).toEqual('done');
  });

  it('waits for long http call then a promise', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowHttpPromiseStatus'));
    var button =
      ptor.findElement(protractor.By.css('[ng-click="slowHttpPromise()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();
    ptor.waitForAngular();

    expect(status.getText()).toEqual('done');
  });
});
