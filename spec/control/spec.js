describe('protractor control flow', function() {
  it('should not deadlock', function() {
    browser.driver.wait(function() {
      return true;
    }, 1000);
    expect(true).toEqual(true);
  });
});
