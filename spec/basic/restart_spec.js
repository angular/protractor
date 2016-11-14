describe('browser.restart', function() {
  it('doesn\'t break ignoreSynchronization', function() {
    browser.get('index.html#/polling');
    browser.restart();

    browser.ignoreSynchronization = true;
    // Get a non-angular page. It shouldn't fail if ignoreSynchronization is on.
    browser.get('https://google.com/');
  });

  afterAll(function() {
    browser.ignoreSynchronization = false;
  });
});
