describe('single failure spec1', function() {
  it('should fail expectation', function() {
    browser.get('index.html');
    var greeting = element(by.binding('greeting'));
    expect(greeting.getText()).toEqual('INTENTIONALLY INCORRECT');
  });
});
