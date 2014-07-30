var util = require('util');

/**
 * These tests show how to turn off Protractor's synchronization
 * when using applications which poll with $http or $timeout.
 * A better solution is to switch to the angular $interval service if possible.
 */
describe('synchronizing with pages that poll', function() {
  beforeEach(function() {
    browser.get('index.html#/polling');
  });

  it('avoids timeouts using ignoreSynchronization', function() {
    var startButton = element(by.id('pollstarter'));

    var count = element(by.binding('count'));
    expect(count.getText()).toEqual('0');

    startButton.click();

    // Turn this on to see timeouts.
    browser.ignoreSynchronization = true;

    count.getText().then(function(text) {
      expect(text).toBeGreaterThan(-1);
    });

    browser.sleep(2000);

    count.getText().then(function(text) {
      expect(text).toBeGreaterThan(1);
    });
  });

  afterEach(function() {
    // Remember to turn it off when you're done!
    browser.ignoreSynchronization = false;
  });
});

/* 
 * Note that after this test runs, $timeout will be running
 * continuously, so any action/browser.get (anything that requires
 * calling waitForAngular will fail
 * i.e.
 *   it('form after polling', function() {
 *     browser.get('index.html#/polling');
 *     var startButton = element(by.id('pollstarter'));
 *     startButton.click();
 *     browser.get('index.html#/form');
 *   });
 */ 
