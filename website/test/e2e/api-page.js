/**
 * Api page object.
 * @constructor
 */
var ApiPage = function() {
  this.menu = $('.api-left-nav');
  this.searchInput = $('#searchInput');
  this.title = $('.api-title');

  /**
   * Select an item from the menu.
   * @param {string} name
   */
  this.clickOnMenuItem = function(name) {
    this.menu.element(by.linkText(name)).click();
  };

  /**
   * Get the labels for all the menu items.
   * @return A promise that resolves to the item labels.
   */
  this.getMenuItems = function() {
    return this.menu.$$('li').map(function(item) {
      return item.getText();
    });
  };

  /**
   * Click on a param type on the params table.
   * @param {string} name
   */
  this.clickOnParamType = function(name) {
    $('[ng-if="currentItem.params"]').element(by.linkText(name)).click();
  };

  /**
   * Click on a returns type on the returns table.
   * @param name
   */
  this.clickOnReturnsType = function(name) {
    $('[ng-if="currentItem.returns"]').element(by.linkText(name)).click();
  };
};

/** @type {ApiPage} */
module.exports = new ApiPage();
