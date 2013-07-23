var webdriver = require('selenium-webdriver');
var protractor = require('../lib/protractor.js');
var util = require('util');
require('../jasminewd');


describe('longer example', function() {
  var ptor = protractor.getInstance();
  
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


