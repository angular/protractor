describe('console plugin', function() {

  var logMessageButton = element(by.id('log-message'));
  var deleteMessageButton = element(by.id('simulate-error'));

  it('should not fail on log and debug messages', function() {
    browser.get('console/index.html');
    logMessageButton.click();
  });

  it('should fail on error message', function() {
    browser.get('console/index.html');
    deleteMessageButton.click();
  });
});
