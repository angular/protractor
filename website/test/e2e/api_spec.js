describe('Api', function() {
  beforeEach(function() {
    browser.get('#/api');
  });

  it('should navigate to the api page', function() {
    expect($('#title').getText()).toBe('Protractor API 1.0.0');
  });

  it('should show element.all() functions', function() {
    var present = $('.api-left-nav').
        element(by.linkText('element.all(locator)')).isPresent();
    expect(present).toBe(true);
  });
});
