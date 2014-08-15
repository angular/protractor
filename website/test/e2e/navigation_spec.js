var menu = require('./menu-partial');

ddescribe('Navigation', function() {
  it('should go to home', function() {
    browser.get('#');
    
    expect($('.protractor-logo').isPresent()).toBe(true);
  });

  it('should have menu items', function() {
    expect(menu.getTopMenuItems()).toEqual([
        'Home',
        'Quick start',
        'Protractor Setup',
        'Protractor Tests',
        'Reference'
    ])
  });
});
