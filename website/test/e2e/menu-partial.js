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

  /**
   * Dropdown api. Used to click on an element under a dropdown or to get the
   * item names under.
   * @param {string} dropdownName
   * @return {{item: Function, itemNames: Function}}
   */
  this.dropdown = function(dropdownName) {

    /**
     * Open a dropdown given its name.
     * @private
     */
    var openDropdown_ = function() {
      $('.navbar-nav').
          element(by.linkText(dropdownName)).
          click();
    };

    return {
      /**
       * Select an item under a menu dropdown.
       * @param {string} itemName
       */
      item: function(itemName) {
        openDropdown_();

        // Click on an element under the open dropdown.
        $('.dropdown.open').
            element(by.linkText(itemName)).
            click();
      },
      /**
       * Get the names of the items under a dropdown menu.
       */
      itemNames: function() {
        openDropdown_();

        return $$('.dropdown.open .dropdown-menu li a').map(function(item) {
          return item.getText();
        });
      }
    };
  };
};

/** @type {MenuPartial} */
module.exports = new MenuPartial();
