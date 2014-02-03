describe('a test that should not get run', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('should deal with alerts', function() {
    var alertButton = $('#alertbutton');
    alertButton.click();
    var alertDialog = browser.switchTo().alert();

    expect(alertDialog.getText()).toEqual('Hello');

    alertDialog.accept();
  });
});
