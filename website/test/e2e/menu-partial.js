/**
 * Page object for the top menu.
 * @constructor
 */
var MenuPartial = function() {
  /**
   * Get the labels for all the top level menu items.
   * @return A promise that resolves to an array of strings.
   */
  this.getTopMenuItems = function() {
    return $$('.navbar-nav > li > a').map(function(item) {
      return item.getText();
    });
  };

  this.dropdown = function(dropdownName) {
    return {
      item: function(itemName) {
        $('.navbar-nav').
            element(by.linkText(dropdownName)).
            click();

        $('.dropdown.open').
            element(by.linkText(itemName)).
            click();
      }
    };
  };
};

/** @type {MenuPartial} */
module.exports = new MenuPartial();
