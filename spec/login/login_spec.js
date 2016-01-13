var env = require('../environment.js');

describe('pages with login', function() {
  it('should log in with a non-Angular page', function() {
    browser.get(env.baseUrl + '/ng1/index.html');

    var angularElement = element(by.model('username'));
    expect(angularElement.getAttribute('value')).toEqual('Anon');

    // Make sure the cookie is still set.
    browser.manage().getCookie('testcookie').then(function(cookie) {
      expect(cookie.value).toEqual('Jane-1234');
    });
  });
});
