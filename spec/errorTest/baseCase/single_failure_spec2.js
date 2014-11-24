describe('single failure spec2', function() {
  it('should fail expectation', function() {
    browser.get('index.html');
    var greeting = element(by.binding('greeting'));
    expect(greeting.getText()).toEqual('INTENTIONALLY INCORRECT');
  });
});
