var util = require('util');

describe('synchronizing with pages that poll', function() {
  var ptor = protractor.getInstance();

  beforeEach(function() {
    ptor.get('app/index.html#/polling');
  });

  it('avoids timeouts using ignoreSynchronization', function() {
    var startButton =
      ptor.findElement(protractor.By.id('pollstarter'));

    var count = ptor.findElement(protractor.By.binding('count'));
    expect(count.getText()).toEqual('0');

    startButton.click();

    // Turn this on to see timeouts.
    ptor.ignoreSynchronization = true;

    count.getText().then(function(text) {
      expect(text).toBeGreaterThan(-1);
    });

    ptor.sleep(2000);

    count.getText().then(function(text) {
      expect(text).toBeGreaterThan(1);
    });
  });

  afterEach(function() {
    // Remember to turn it off when you're done!
    ptor.ignoreSynchronization = false;
  });
});
