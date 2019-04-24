describe('slow asynchronous events', () => {
  beforeEach(async () => {
    await browser.get('index.html#/async');
  });

  it('waits for http calls', async () => {
    const status = element(by.binding('slowHttpStatus'));
    const button = element(by.css('[ng-click="slowHttp()"]'));

    expect(await status.getText()).toEqual('not started');

    await button.click();

    expect(await status.getText()).toEqual('done');
  });

  it('waits for $timeout', async () => {
    const status = element(by.binding('slowAngularTimeoutStatus'));
    const button = element(by.css('[ng-click="slowAngularTimeout()"]'));

    expect(await status.getText()).toEqual('not started');

    await button.click();

    expect(await status.getText()).toEqual('done');
  });
});
