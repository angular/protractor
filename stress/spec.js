// We just want to do a ton of page navigation for stress tests.

var ITERS = 20;

describe('stress testing', function() {
  for (var i = 0; i < ITERS; ++i) {
    it('should run test ' + i, function() {
      var usernameInput = element(by.model('username'));
      var name = element(by.binding('username'));

      browser.get('index.html#/form');

      expect(name.getText()).toEqual('Anon');

      usernameInput.clear();
      usernameInput.sendKeys('B');
      expect(name.getText()).toEqual('B');
    });
  }
});
