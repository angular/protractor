var env = require('../environment.js');

describe('pages with login', function() {
  it('should set a cookie', function() {
    browser.get(env.baseUrl + '/index.html');

    browser.manage().addCookie('testcookie', 'Jane-1234');

    // Make sure the cookie is set.
    browser.manage().getCookie('testcookie').then(function(cookie) {
      expect(cookie.value).toEqual('Jane-1234');
    });
  });

  it('should check the cookie is gone', function() {
    browser.get(env.baseUrl + '/index.html');

    // Make sure the cookie is gone.
    browser.manage().getCookie('testcookie').then(function(cookie) {
      expect(cookie).toEqual(null);
    });
  });
});
