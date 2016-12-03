describe('selenium session id', function() {
  var URL = '/ng2/#/async';

  beforeEach(function() {
    browser.get(URL);
  });
  it('should be able to use an existing session', function() {
    var increment = $('#increment');
    expect(increment).toBeDefined();
  });
});
