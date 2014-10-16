describe('timeout spec', function() {
  it('should timeout due to jasmine spec limit', function() {
    browser.get('index.html#/form');
  }, 1);
});
