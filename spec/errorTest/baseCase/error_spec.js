describe('error spec', function() {
  it('should throw an error', function() {
    browser.get('index.html');
    var greeting = element(by.binding('INVALID'));
  });
});
