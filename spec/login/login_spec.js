const env = require('../environment.js');

describe('pages with login', () => {
  it('should log in with a non-Angular page', async() => {
    await browser.get(env.baseUrl + '/ng1/index.html');

    const angularElement = element(by.model('username'));
    expect(await angularElement.getAttribute('value')).toEqual('Anon');

    // Make sure the cookie is still set.
    const cookie = await browser.manage().getCookie('testcookie');
    expect(cookie.value).toEqual('Jane-1234');
  });
});
