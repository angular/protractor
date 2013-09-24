describe('pages with login', function() {
  var ptor;

  beforeEach(function() {
    ptor = protractor.getInstance();
  })

  it('should log in with a non-Angular page', function() {
    ptor.get('http://localhost:8000/app/index.html');

    var angularElement = ptor.findElement(protractor.By.input('url'));
    expect(angularElement.getAttribute('value')).toEqual('/fastcall');

    // Make sure the cookie is still set.
    ptor.manage().getCookie('testcookie').then(function(cookie) {
      expect(cookie.value).toEqual('Jane-1234');
    });
  });
});
