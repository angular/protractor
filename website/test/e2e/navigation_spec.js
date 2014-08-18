/** @type {MenuPartial} */
var menu = require('./menu-partial');

describe('Navigation', function() {
  beforeEach(function() {
    browser.get('#');
  });

  it('should go to home', function() {
    expect($('.protractor-logo').isPresent()).toBe(true);
  });
  
  it('should go to tutorial', function() {
    menu.dropdown('Quick Start').item('Tutorial');

    expect($('h1').getText()).toBe('Tutorial');
  });

  describe('Menu items', function() {
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

    it('should have items under Quick Start', function() {
      expect(menu.dropdown('Quick Start').itemNames()).toEqual([
        'Tutorial'
      ]);
    });
    
    it('should have items under Protractor Setup', function() {
      expect(menu.dropdown('Protractor Setup').itemNames()).toEqual([
          'Setting Up Protractor',
          'Setting Up the Selenium Server',
          'Setting Up the Browser',
          'Choosing a Framework'
      ]);
    });

    it('should have items under Protractor Tests', function() {
      expect(menu.dropdown('Protractor Tests').itemNames()).toEqual([
          'Getting Started',
          'Tutorial',
          'Working with Spec and Config Files',
          'Setting Up the System Under Test',
          'Using Locators',
          'Using Page Objects to Organize Tests',
          'Debugging Protractor Tests'
      ]);
    });

    it('should have itmes under Reference', function() {
      expect(menu.dropdown('Reference').itemNames()).toEqual([
        'Configuration File Reference',
        'Protractor API',
        'Timeouts',
        'The WebDriver Control Flow',
        'How It Works',
        'FAQ'
      ]);
    });
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

    it('should go to Choosing a Framework', function() {
      menu.dropdown('Protractor Setup').item('Choosing a Framework');

      expect($('h1').getText()).toBe('Choosing a Framework');
    });
  });
});
