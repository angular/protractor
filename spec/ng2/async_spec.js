describe('async angular2 application', () => {
  const URL = '/ng2/#/async';

  beforeEach(async() => {
    await browser.get(URL);
  });

  it('should work with synchronous actions', async() => {
    const increment = $('#increment');
    await increment.$('.action').click();

    expect(await increment.$('.val').getText()).toEqual('1');
  });

  it('should wait for asynchronous actions', async() => {
    const timeout = $('#delayedIncrement');

    // At this point, the async action is still pending, so the count should
    // still be 0.
    expect(await timeout.$('.val').getText()).toEqual('0');

    await timeout.$('.action').click();

    expect(await timeout.$('.val').getText()).toEqual('1');
  });

  it('should turn off when ignoreSynchronization is true', async() => {
    // const timeout = $('#delayedIncrement');

    // At this point, the async action is still pending, so the count should
    // still be 0.
    expect(await $('#delayedIncrement').$('.val').getText()).toEqual('0');

    await browser.waitForAngularEnabled(false);

    await $('#delayedIncrement').$('.action').click();
    await $('#delayedIncrement').$('.cancel').click();

    await browser.waitForAngularEnabled(true);

    // whenStable should be called since the async action is cancelled. The
    // count should still be 0;
    expect(await $('#delayedIncrement').$('.val').getText()).toEqual('0');
  });

  it('should wait for a series of asynchronous actions', async() => {
    const timeout = $('#chainedDelayedIncrements');

    // At this point, the async action is still pending, so the count should
    // still be 0.
    expect(await timeout.$('.val').getText()).toEqual('0');

    await timeout.$('.action').click();

    expect(await timeout.$('.val').getText()).toEqual('10');
  });

  describe('long async spec', () => {
    let originalTimeout;
    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    it('should wait for a series of periodic increments', async() => {
      const timeout = $('#periodicIncrement_unzoned');

      // Waits for the val to count 2.
      const EC = protractor.ExpectedConditions;
      await timeout.$('.action').click();
      // Increase waiting time from 4s to 7s due to slow connection during SauceLabs tests
      await browser.wait(EC.textToBePresentInElement(timeout.$('.val'), '1'),
          7000);
      await timeout.$('.cancel').click();

      const text = await timeout.$('.val').getText();
      await browser.driver.sleep(3000);
      expect(await timeout.$('.val').getText()).toEqual(text);
    });

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
  });
});
