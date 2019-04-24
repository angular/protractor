describe('async angular2 application timeout', () => {
  const URL = '/ng2/#/async';

  it('should timeout if intervals are used in the NgZone', async () => {
    await browser.get(URL);
    const timeout = $('#periodicIncrement');
    await timeout.$('.action').click();
    await timeout.$('.cancel').click();
  });
});
