var util = require('util');

describe('synchronizing with pages that poll', function() {
  var ptor = protractor.getInstance();

  beforeEach(function() {
    ptor.get('app/index.html#/polling');
  });

  it('times out :(', function() {
    var startButton =
      ptor.findElement(protractor.By.id('pollstarter'));

    var count = ptor.findElement(protractor.By.binding('count'));
    expect(count.getText()).toEqual('0');

    startButton.click();

    count.getText().then(function(text) {
      expect(text).toBeGreaterThan(2);
    });
  });
});
