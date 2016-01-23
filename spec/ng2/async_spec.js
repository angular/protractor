describe('async angular2 application', function() {
  var URL = '/ng2/#/async';

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
    var timeout = $('#chainedDelayedIncrements');

    // At this point, the async action is still pending, so the count should
    // still be 0.
    expect(timeout.$('.val').getText()).toEqual('0');

    timeout.$('.action').click();

    expect(timeout.$('.val').getText()).toEqual('10');
  });

  it('should wait for a series of periodic increments', function() {
    var timeout = $('#periodicIncrement');

    // Waits for the val to count to 1 and 2.
    var EC = protractor.ExpectedConditions;
    timeout.$('.action').click();
    browser.wait(EC.textToBePresentInElement(timeout.$('.val'), '1'), 3000);
    timeout.$('.cancel').click();

    var text = timeout.$('.val').getText();
    browser.driver.sleep(3000);
    expect(timeout.$('.val').getText()).toEqual(text);

    timeout.$('.action').click();
    browser.wait(EC.textToBePresentInElement(timeout.$('.val'), '3'), 6000);
    timeout.$('.cancel').click();

    text = timeout.$('.val').getText();
    browser.driver.sleep(3000);
    expect(timeout.$('.val').getText()).toEqual(text);

  });
});
