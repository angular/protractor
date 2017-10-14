describe('using an ActionSequence', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  // TODO(cnishina): update when mouseMoveTo works in the next release of selenium-webdriver.
  // Refer to selenium-webdriver issue 3693. https://github.com/SeleniumHQ/selenium/issues/3693
  xit('should drag and drop', function() {
    var sliderBar = element(by.name('points'));

    expect(sliderBar.getAttribute('value')).toEqual('1');

    browser.actions().
        dragAndDrop(sliderBar, {x: 400, y: 20}).
        perform();

    expect(sliderBar.getAttribute('value')).toEqual('10');
  });
});
