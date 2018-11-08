describe('synchronizing with slow pages', () => {
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

  it('waits for long javascript execution', async () => {
    const status = element(by.binding('slowFunctionStatus'));
    const button = element(by.css('[ng-click="slowFunction()"]'));
    expect(await status.getText()).toEqual('not started');

    await button.click();
    expect(await status.getText()).toEqual('done');
  });

  it('DOES NOT wait for timeout', async () => {
    const status = element(by.binding('slowTimeoutStatus'));
    const button = element(by.css('[ng-click="slowTimeout()"]'));
    expect(await status.getText()).toEqual('not started');

    await button.click();
    expect(await status.getText()).toEqual('pending...');
  });

  it('waits for $timeout', async () => {
    const status = element(by.binding('slowAngularTimeoutStatus'));
    const button = element(by.css('[ng-click="slowAngularTimeout()"]'));
    expect(await status.getText()).toEqual('not started');

    await button.click();
    expect(await status.getText()).toEqual('done');
  });

  it('waits for $timeout then a promise', async () => {
    const status = element(by.binding('slowAngularTimeoutPromiseStatus'));
    const button = element(by.css('[ng-click="slowAngularTimeoutPromise()"]'));
    expect(await status.getText()).toEqual('not started');

    await button.click();
    expect(await status.getText()).toEqual('done');
  });

  it('waits for long http call then a promise', async () => {
    const status = element(by.binding('slowHttpPromiseStatus'));
    const button = element(by.css('[ng-click="slowHttpPromise()"]'));
    expect(await status.getText()).toEqual('not started');

    await button.click();
    expect(await status.getText()).toEqual('done');
  });

  it('waits for slow routing changes', async () => {
    const status = element(by.binding('routingChangeStatus'));
    const button = element(by.css('[ng-click="routingChange()"]'));
    expect(await status.getText()).toEqual('not started');

    await button.click();
    expect(await browser.getPageSource()).toMatch('polling mechanism');
  });

  it('waits for slow ng-include templates to load', async () => {
    const status = element(by.css('.included'));
    const button = element(by.css('[ng-click="changeTemplateUrl()"]'));
    expect(await status.getText()).toEqual('fast template contents');

    await button.click();
    expect(await status.getText()).toEqual('slow template contents');
  });
});
