describe('success spec', function() {
  it('should pass', function() {
    browser.get('index.html');
    var greeting = element(by.binding('greeting'));
    expect(greeting.getText()).toEqual('Hiya');
  });
});
