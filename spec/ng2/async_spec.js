describe('async angular2 application', function() {
  var URL = 'examples/src/async/index.html';

  beforeEach(function() {
    browser.get(URL);
  });

  it('should work with synchronous actions', function() {
    var increment = $('#increment');
    increment.$('.action').click();

    expect(increment.$('.val').getText()).toEqual('1');
  });

  it('should wait for asynchronous actions', function() {
    var timeout = $('#delayedIncrement');

    // At this point, the async action is still pending, so the count should
    // still be 0.
    expect(timeout.$('.val').getText()).toEqual('0');

    timeout.$('.action').click();

    expect(timeout.$('.val').getText()).toEqual('1');
  });

  it('should turn off when ignoreSynchronization is true', function() {
    var timeout = $('#delayedIncrement');

    // At this point, the async action is still pending, so the count should
    // still be 0.
    expect(timeout.$('.val').getText()).toEqual('0');

    browser.ignoreSynchronization = true;

    timeout.$('.action').click();
    timeout.$('.cancel').click();

    browser.ignoreSynchronization = false;

    // whenStable should be called since the async action is cancelled. The
    // count should still be 0;
    expect(timeout.$('.val').getText()).toEqual('0');
  });

  it('should wait for a series of asynchronous actions', function() {
    var timeout = $('#multiDelayedIncrements');

    // At this point, the async action is still pending, so the count should
    // still be 0.
    expect(timeout.$('.val').getText()).toEqual('0');

    timeout.$('.action').click();

    expect(timeout.$('.val').getText()).toEqual('10');
  });
});
