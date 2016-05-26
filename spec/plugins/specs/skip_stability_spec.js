describe('plugins that can disable synchronization', function() {
  beforeEach(function() {
    browser.get('index.html#/async');
  });

  it('DOES NOT wait for $timeout with synchronization disabled', function() {
    protractor._PluginSetSkipStability(true);
    var status = element(by.binding('slowAngularTimeoutStatus'));
    var button = element(by.css('[ng-click="slowAngularTimeout()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('pending...');
  });

  it('waits for $timeout with synchronization enabled', function() {
    protractor._PluginSetSkipStability(false);
    var status = element(by.binding('slowAngularTimeoutStatus'));
    var button = element(by.css('[ng-click="slowAngularTimeout()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });
});
