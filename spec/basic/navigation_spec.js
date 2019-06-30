const env = require('./../environment.js');

describe('navigation', () => {
  beforeEach(async () => {
    await browser.get('index.html#/form');
  });

  it('should deal with alerts', async () => {
    const alertButton = $('#alertbutton');
    await alertButton.click();
    const alertDialog = await browser.switchTo().alert();

    expect(await alertDialog.getText()).toEqual('Hello');

    await alertDialog.accept();
  });

  it('should refresh properly', async () => {
    const username = element(by.model('username'));
    const name = element(by.binding('username'));
    await username.clear();
    expect(await name.getText()).toEqual('');

    await browser.navigate().refresh();

    expect(await name.getText()).toEqual('Anon');
  });
  
  it('should navigate back and forward properly', async () => {
    await browser.get('index.html#/repeater');
    expect(await browser.getCurrentUrl()).toEqual(`${env.baseUrl}/ng1/index.html#/repeater`);

    await browser.navigate().back();
    expect(await browser.getCurrentUrl()).toEqual(`${env.baseUrl}/ng1/index.html#/form`);

    await browser.navigate().forward();
    expect(await browser.getCurrentUrl()).toEqual(`${env.baseUrl}/ng1/index.html#/repeater`);
  });

  it('should navigate back and forward properly from link', async () => {
    await element(by.linkText('repeater')).click();
    expect(await browser.getCurrentUrl()).toEqual(`${browser.baseUrl}index.html#/repeater`);
  
    await browser.navigate().back();
    expect(await browser.getCurrentUrl()).toEqual(`${browser.baseUrl}index.html#/form`);
  
    await browser.navigate().forward();
    expect(await browser.getCurrentUrl()).toEqual(`${browser.baseUrl}index.html#/repeater`);
  });
});
