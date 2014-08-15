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
};

/** @type {ApiPage} */
module.exports = new ApiPage();
