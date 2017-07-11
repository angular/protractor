/** @type {MenuPartial} */
var menu = require('./menu-partial');

describe('Navigation', function() {
  beforeEach(function() {
    browser.get('#');
  });

  it('should go to home', function() {
    menu.dropdown('Home').open();

    expect($('.protractor-logo').isPresent()).toBe(true);
  });

  it('should go to tutorial', function() {
    menu.dropdown('Quick Start').item('Tutorial');

    expect($('h1').getText()).toBe('Tutorial');
  });

  describe('Menu items', function() {
    it('should have menu items', function() {
      // Make sure all the top level menu labels are present.
      expect(menu.topMenuItems.getText()).toEqual([
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

    it('should have items under Reference', function() {
      expect(menu.dropdown('Reference').itemNames()).toEqual([
        'Configuration File',
        'Protractor API',
        'Style Guide',
        'Protractor Syntax vs WebDriverJS Syntax',
        'Browser Support',
        'Plugins',
        'Timeouts',
        'The WebDriver Control Flow',
        'Using TypeScript',
        'Using async/await',
        'How It Works',
        'Upgrading to Jasmine 2.x',
        'Mobile Setup',
        'FAQ'
      ]);
    });
  });

  describe('Protractor Setup', function() {
    it('should go to Setting Up Protractor', function() {
      menu.dropdown('Protractor Setup').item('Setting Up Protractor');

      expect($('h1').getText()).toBe('Setting Up Protractor');
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

  describe('Protractor Tests', function() {
    it('should go to Getting Started', function() {
      menu.dropdown('Protractor Tests').item('Getting Started');

      expect($('h1').getText()).toBe('Getting Started');
    });

    it('should go to Tutorial', function() {
      menu.dropdown('Protractor Tests').item('Tutorial');

      expect($('h1').getText()).toBe('Tutorial');
    });

    it('should go to Working with Spec and Config Files', function() {
      menu.dropdown('Protractor Tests').item('Working with Spec and Config Files');

      expect($$('h1').get(0).getText()).toBe('Working with Spec and Config Files');
    });

    it('should go to Setting Up the System Under Test', function() {
      menu.dropdown('Protractor Tests').item('Setting Up the System Under Test');

      expect($('h1').getText()).toBe('Setting Up the System Under Test');
    });

    it('should go to Using Locators', function() {
      menu.dropdown('Protractor Tests').item('Using Locators');

      expect($('h1').getText()).toBe('Using Locators');
    });

    it('should go to Using Page Objects to Organize Tests', function() {
      menu.dropdown('Protractor Tests').item('Using Page Objects to Organize Tests');

      expect($('h1').getText()).toBe('Using Page Objects to Organize Tests');
    });

    it('should go to Debugging Protractor Tests', function() {
      menu.dropdown('Protractor Tests').item('Debugging Protractor Tests');

      expect($('h1').getText()).toBe('Debugging Protractor Tests');
    });
  });

  describe('Reference', function() {
    it('should go to Protractor API', function() {
      menu.dropdown('Reference').item('Protractor API');

      expect($('#title').getText()).toMatch('Protractor API');
    });

    it('should go to Style Guide', function() {
      menu.dropdown('Reference').item('Style Guide');

      expect($('h1').getText()).toBe('Protractor style guide');
    });

    it('should go to Timeouts', function() {
      menu.dropdown('Reference').item('Timeouts');

      expect($('h1').getText()).toBe('Timeouts');
    });

    it('should go to Browser Support', function() {
      menu.dropdown('Reference').item('Browser Support');

      expect($('h1').getText()).toBe('Browser Support');
    });

    it('should go to Plugins', function() {
      menu.dropdown('Reference').item('Plugins');

      expect($('h1').getText()).toBe('Protractor Plugins');
    });

    it('should go to The WebDriver Control Flow', function() {
      menu.dropdown('Reference').item('The WebDriver Control Flow');

      expect($('h1').getText()).toBe('The WebDriver Control Flow');
    });

    it('should go to How It Works', function() {
      menu.dropdown('Reference').item('How It Works');

      expect($('h1').getText()).toBe('How It Works');
    });

    it('should go to Upgrading to Jasmine 2.x', function() {
      menu.dropdown('Reference').item('Upgrading to Jasmine 2.x');

      expect($('h1').getText()).toBe('Upgrading from Jasmine 1.3 to 2.x');
    });

    it('should go to Mobile Setup', function() {
      menu.dropdown('Reference').item('Mobile Setup');

      expect($('h1').getText()).toBe('Mobile Setup');
    });

    it('should go to FAQ', function() {
      menu.dropdown('Reference').item('FAQ');

      expect($('h1').getText()).toBe('FAQ');
    });
  });
});
