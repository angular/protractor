/** @type {ApiPage} */
var apiPage = require('./api-page');

describe('Api', function() {
  beforeEach(function() {
    browser.get('#/api');
  });

  it('should navigate to the api page', function() {
    expect($('#title').getText()).toBe('Protractor API 1.0.0');
    expect(apiPage.title.getText()).toBe('Protractor API Docs');
  });

  it('should search and find map', function() {
    apiPage.searchInput.sendKeys('map');

    // Ensure the following elements are shown:
    // element.all
    // map
    apiPage.getMenuItems().then(function(items) {
      expect(items[0]).toBe('element.all(locator)');
      expect(items[1]).toBe('map');
    });
  });

  it('should show item when you click on it', function() {
    // When you click on element.all(locator).
    apiPage.clickOnMenuItem('element.all(locator)');

    // Then ensure the item is shown.
    expect(apiPage.title.getText()).toBe('element.all(locator) View code');
  });

  it('should view item in param link', function() {
    // Given that you are viewing element.all.
    apiPage.clickOnMenuItem('element.all(locator)');

    // When you click on the ElementFinder link of the params table.
    apiPage.clickOnParamType('ElementFinder');

    // Then ensure the type is shown.
    expect(apiPage.title.getText()).toBe('element(locator) View code');
  });

  it('should view item in returns link', function() {
    // Given that you are viewing 'element.all(locator).first()'.
    apiPage.clickOnMenuItem('first');

    // When you click on the 'ElementFinder' link of the Returns table.
    apiPage.clickOnReturnsType('ElementFinder');

    // Then ensure the type is shown.
    expect(apiPage.title.getText()).toBe('element(locator) View code');
  });
});
