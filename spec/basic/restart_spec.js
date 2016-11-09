describe('browser.restart', function() {
  it('doesn\'t break ignoreSynchronization', function() {
    browser.get('index.html#/polling');

    browser.restart();

    browser.ignoreSynchronization = true;

    // Get a non-angular page. It shouldn't fail if ignoreSynchronization is on.
    browser.driver.get("https://google.com/");

    var EC = protractor.ExpectedConditions;

    browser.driver.wait(EC.visibilityOf($("#start-of-content")));
  });
});
