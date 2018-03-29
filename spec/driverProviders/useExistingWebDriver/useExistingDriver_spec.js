describe('uses existing webdriver', function() {
  var URL = '/ng2/#/async';

  beforeEach(function() {
    browser.get(URL);
  });
  it('should be able to use an existing session', function() {
    var increment = $('#increment');
    expect(increment).toBeDefined();
  });
  // the driverProvider is set up to ignore the quitDriver() call;
  // so we call quit() ourselves to tidy up when testing is done.
  afterEach(function() {
    browser.quit();
  });
});
