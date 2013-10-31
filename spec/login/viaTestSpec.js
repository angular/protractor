describe('pages with login', function() {
  it('should log in with a non-Angular page', function() {
    browser.driver.get('http://localhost:8000/app/login.html');

    browser.driver.findElement(by.id('username')).sendKeys('Jane');
    browser.driver.findElement(by.id('password')).sendKeys('1234');
    browser.driver.findElement(by.id('clickme')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    browser.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        return /index/.test(url);
      });
    });

    // The login should have set a cookie. Make sure it's there.
    browser.manage().getCookie('testcookie').then(function(cookie) {
      expect(cookie.value).toEqual('Jane-1234');
    });


    browser.get('http://localhost:8000/index.html');

    var angularElement = element(by.input('url'));
    expect(angularElement.getAttribute('value')).toEqual('/fastcall');

    // Make sure the cookie is still set.
    browser.manage().getCookie('testcookie').then(function(cookie) {
      expect(cookie.value).toEqual('Jane-1234');
    });
  });
});
