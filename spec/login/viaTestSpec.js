describe('pages with login', function() {
  var ptor;

  beforeEach(function() {
    ptor = protractor.getInstance();
  })

  it('should log in with a non-Angular page', function() {
    ptor.driver.get('http://localhost:8000/app/login.html');

    ptor.driver.findElement(protractor.By.id('username')).sendKeys('Jane');
    ptor.driver.findElement(protractor.By.id('password')).sendKeys('1234');
    ptor.driver.findElement(protractor.By.id('clickme')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    ptor.wait(function() {
      return ptor.driver.getCurrentUrl().then(function(url) {
        return /index/.test(url);
      });
    });

    // The login should have set a cookie. Make sure it's there.
    ptor.manage().getCookie('testcookie').then(function(cookie) {
      expect(cookie.value).toEqual('Jane-1234');
    });


    ptor.get('http://localhost:8000/app/index.html');

    var angularElement = ptor.findElement(protractor.By.input('url'));
    expect(angularElement.getAttribute('value')).toEqual('/fastcall');

    // Make sure the cookie is still set.
    ptor.manage().getCookie('testcookie').then(function(cookie) {
      expect(cookie.value).toEqual('Jane-1234');
    });
  });
});
