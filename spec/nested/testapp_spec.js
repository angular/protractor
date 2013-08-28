var util = require('util');

describe('longer example', function() {
  var ptor = protractor.getInstance();

  describe('synchronizing with Angular', function() {
    describe('http calls', function() {
      beforeEach(function() {
        ptor.get('app/nested.html');
      });

      it('should wait for slow RPCs', function() {
        var sample1Button = ptor.findElement(protractor.By.id('sample1'));
        var sample2Button = ptor.findElement(protractor.By.id('sample2'));
        sample1Button.click();

        var fetchButton = ptor.findElement(protractor.By.id('fetch'));
        fetchButton.click();

        // The quick RPC works fine.
        var status = ptor.findElement(protractor.By.binding('{{status}}'));
        expect(status.getText()).toEqual('200');
        expect(ptor.findElement(protractor.By.binding('data')).getText()).
            toEqual('done');

        // Slow RPC.
        sample2Button.click();
        fetchButton.click();
        // Would normally need ptor.sleep(2) or something.
        expect(ptor.findElement(protractor.By.id('statuscode')).getText()).
            toEqual('200');

        expect(ptor.findElement(protractor.By.id('data')).getText()).
            toEqual('finally done');
      });
    });

    describe('slow rendering', function() {
      beforeEach(function() {
        ptor.get('app/nested.html#/repeater');
      });

      it('should synchronize with a slow action', function() {
        var addOneButton = ptor.findElement(protractor.By.id('addone'));
        addOneButton.click();
        var topNumber = ptor.findElement(
            protractor.By.repeater('foo in foos').row(1).
            column('{{foo.b}}'));

        expect(topNumber.getText()).toEqual('14930352');

        addOneButton.click();

        topNumber = ptor.findElement(
            protractor.By.repeater('foo in foos').row(1).
            column('{{foo.b}}'));

        expect(topNumber.getText()).toEqual('24157817');
      });
    });
  });

});