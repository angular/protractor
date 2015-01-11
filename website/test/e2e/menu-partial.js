/**
 * Page object for the top menu.
 * @constructor
 */
var MenuPartial = function() {
  this.topMenuItems = $$('.navbar-nav > li > a');

  /**
   * Dropdown api. Used to click on an element under a dropdown or to get the
   * item names under.
   * @param {string} dropdownName
   * @return {{item: Function, itemNames: Function}}
   */
  this.dropdown = function(dropdownName) {
    return {
      /**
       * Open a dropdown given its name.
       */
      open: function() {
        $('.navbar-nav')
            .element(by.linkText(dropdownName))
            .click();
      },
      /**
       * Select an item under a menu dropdown.
       * @param {string} itemName
       */
      item: function(itemName) {
        this.open();

        // Click on an element under the open dropdown.
        $('.dropdown.open')
            .element(by.linkText(itemName))
            .click();
      },
      /**
       * Get the names of the items under a dropdown menu.
       */
      itemNames: function() {
        this.open();

        return $$('.dropdown.open .dropdown-menu li a')
            .getText();
      }
    };
  };
};

/** @type {MenuPartial} */
module.exports = new MenuPartial();
