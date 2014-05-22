describe('using an ActionSequence', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('should drag and drop', function() {
    var sliderBar = element(by.name('points'));

    expect(sliderBar.getAttribute('value')).toEqual('1');

    browser.actions().
        dragAndDrop(sliderBar, {x: 400, y: 20}).
        perform();

    expect(sliderBar.getAttribute('value')).toEqual('10');
  });
});
