describe('Api', function() {
  beforeEach(function() {
    browser.get('#/api');
  });

  it('should navigate to the api page', function() {
    expect($('#title').getText()).toBe('Protractor API 1.0.0');
  });

  it('should show element.all()', function() {
    var present = $('.api-left-nav').
        element(by.linkText('element.all(locator)')).isPresent();
    expect(present).toBe(true);
  });

  it('should search and find map', function() {
    $('#searchInput').sendKeys('map');

    // Ensure the following elements are shown:
    // element.all
    // map
    $('.api-left-nav').$$('li').map(function(item) {
      return item.getText();
    }).then(function(items) {
      expect(items[0]).toBe('element.all(locator)');
      expect(items[1]).toBe('map');
    });
  });
});
