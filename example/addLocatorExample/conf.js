// An example configuration file for addLocation function usage with mocha framework.
exports.config = {
  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  specs: ['addLocator_usage_example_spec.js'],

  onPrepare: function() {
    // Create custom locator to get checkbox component by text
    By.addLocator('checkboxText', function(checkboxText, opt_parentElement) {
      // The first argument is checkbox text and second one opt_parentElement
      // if needed. At first, we search for all [mat-checkbox] components.
      var using = opt_parentElement || document;
      var checkboxes = using.querySelectorAll('mat-checkbox');

      // Now filter them and return checkboxes which match user
      // defined text.
      return Array.prototype.filter.call(checkboxes, function(checkbox) {
        return checkbox.textContent.indexOf(checkboxText) !== -1;
      });
    });
  }
};
