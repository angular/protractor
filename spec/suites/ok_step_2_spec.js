describe('Step 2 from step suite', function() {
  it('should be on AngularJS homepage', function() {
    expect(browser.getCurrentUrl()).toBe('https://www.angularjs.org/');
  });
});