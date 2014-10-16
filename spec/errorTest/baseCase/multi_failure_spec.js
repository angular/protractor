describe('multi failure spec', function() {
  it('should fail expectation', function() {
    browser.get('index.html');
    var greeting = element(by.binding('greeting'));
    expect(greeting.getText()).toEqual('INTENTIONALLY INCORRECT');
  });

  it('should fail expectation again', function() {
    browser.get('index.html');
    var greeting = element(by.binding('greeting'));
    expect(greeting.getText()).toEqual('INTENTIONALLY INCORRECT AGAIN');
  });
});
