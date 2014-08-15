/**
 * Page object for the top menu.
 * @constructor
 */
var MenuPartial = function() {
  this.getTopMenuItems = function() {
    return $$('.navbar-nav > li > a').map(function(item) {
      return item.getText();
    });
  };
};

/** @type {MenuPartial} */
module.exports = new MenuPartial();
