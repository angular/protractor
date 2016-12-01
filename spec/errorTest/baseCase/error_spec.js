describe('finding an element that does not exist', function() {
  it('should throw an error', function() {
    browser.get('index.html');
    element(by.binding('INVALID'));  // greeting
  });
});
