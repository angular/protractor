describe('modifying config in beforeLaunch', function() {
  it('allows a config file to set params', function() {
    browser.get('index.html#/form');
    var greeting = element(by.binding('greeting'));

    expect(greeting.getText()).toEqual('Hiya');
  });
});
