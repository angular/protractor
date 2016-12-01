describe('synchronizing with slow pages', function() {
  beforeEach(function() {
    browser.get('index.html#/async');
  });

  it('waits for http calls', function() {
    var status = element(by.binding('slowHttpStatus'));
    var button = element(by.css('[ng-click="slowHttp()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });

  it('waits for long javascript execution', function() {
    var status = element(by.binding('slowFunctionStatus'));
    var button = element(by.css('[ng-click="slowFunction()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });

  it('DOES NOT wait for timeout', function() {
    var status = element(by.binding('slowTimeoutStatus'));
    var button = element(by.css('[ng-click="slowTimeout()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('pending...');
  });

  it('waits for $timeout', function() {
    var status = element(by.binding('slowAngularTimeoutStatus'));
    var button = element(by.css('[ng-click="slowAngularTimeout()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });

  it('waits for $timeout then a promise', function() {
    var status = element(by.binding(
          'slowAngularTimeoutPromiseStatus'));
    var button = element(by.css(
          '[ng-click="slowAngularTimeoutPromise()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });

  it('waits for long http call then a promise', function() {
    var status = element(by.binding('slowHttpPromiseStatus'));
    var button = element(by.css('[ng-click="slowHttpPromise()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });

  it('waits for slow routing changes', function() {
    var status = element(by.binding('routingChangeStatus'));
    var button = element(by.css('[ng-click="routingChange()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(browser.getPageSource()).toMatch('polling mechanism');
  });

  it('waits for slow ng-include templates to load', function() {
    var status = element(by.css('.included'));
    var button = element(by.css('[ng-click="changeTemplateUrl()"]'));

    expect(status.getText()).toEqual('fast template contents');

    button.click();

    expect(status.getText()).toEqual('slow template contents');
  });
});
