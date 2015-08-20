describe('slow asynchronous events', function() {
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

  it('waits for $timeout', function() {
    var status = element(by.binding('slowAngularTimeoutStatus'));
    var button = element(by.css('[ng-click="slowAngularTimeout()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });
});
