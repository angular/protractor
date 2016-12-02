describe('local driver provider', function() {
  var URL = '/ng2/#/async';

  it('should get a page and find an element', function() {
    browser.get(URL);
    var increment = $('#increment');
    expect(increment).toBeDefined();
  });

  it('should get a forked instance, and find an element', function() {
    browser.get(URL);
    var browser2 = browser.forkNewDriverInstance();
    browser2.get(URL);
    var increment = browser2.$('#increment');
    expect(increment).toBeDefined();
  });
});
