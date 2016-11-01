describe('console plugin', function() {

  var logMessageButton = element(by.id('log-message'));
  var warningMessageButton = element(by.id('simulate-warning'));
  var deleteMessageButton = element(by.id('simulate-error'));

  it('should not fail on log and debug messages', function() {
    browser.get('console/index.html');
    logMessageButton.click();
  });

  it('should not fail on warning message', function() {
    browser.get('console/index.html');
    warningMessageButton.click();
  });

  it('should not fail on error message', function() {
    browser.get('console/index.html');
    deleteMessageButton.click();
  });
});
