/** @type {MenuPartial} */
var menu = require('./menu-partial');

ddescribe('Navigation', function() {
  beforeEach(function() {
    browser.get('#');
  });

  it('should go to home', function() {
    expect($('.protractor-logo').isPresent()).toBe(true);
  });

  it('should have menu items', function() {
    // Make sure all the top level menu labels are present.
    expect(menu.getTopMenuItems()).toEqual([
      'Home',
      'Quick Start',
      'Protractor Setup',
      'Protractor Tests',
      'Reference'
    ]);
  });

  it('should go to tutorial', function() {
    menu.dropdown('Quick Start').item('Tutorial');

    expect($('h1').getText()).toBe('Tutorial');
  });

  describe('Protractor Setup', function() {
    it('should go to Setting Up Protractor', function() {
      menu.dropdown('Protractor Setup').item('Setting Up Protractor');

      expect($('h1').getText()).toBe('Getting Installed');
    });
    
    it('should go to Setting Up the Selenium Server', function() {
      menu.dropdown('Protractor Setup').item('Setting Up the Selenium Server');

      expect($('h1').getText()).toBe('Setting Up the Selenium Server');
    });

    it('should go to Setting Up the Browser', function() {
      menu.dropdown('Protractor Setup').item('Setting Up the Browser');

      expect($('h1').getText()).toBe('Setting Up the Browser');
    });
  });
});
