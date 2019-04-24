const env = require('../environment.js');

describe('pages with login', () => {
  it('should set a cookie', async() => {
    await browser.get(env.baseUrl + '/ng1/index.html');

    await browser.manage().addCookie({name:'testcookie', value: 'Jane-1234'});

    // Make sure the cookie is set.
    const cookie = await browser.manage().getCookie('testcookie');
    expect(cookie.value).toEqual('Jane-1234');
  });

  it('should check the cookie is gone', async() => {
    await browser.get(env.baseUrl + '/ng1/index.html');

    // Make sure the cookie is gone.
    const cookie = await browser.manage().getCookie('testcookie');
    expect(cookie).toEqual(null);
  });
});
