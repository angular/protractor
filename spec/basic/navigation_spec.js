var env = require('../environment.js');

describe('navigation', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('should deal with alerts', function() {
    var alertButton = $('#alertbutton');
    alertButton.click();
    var alertDialog = browser.switchTo().alert();

    expect(alertDialog.getText()).toEqual('Hello');

    alertDialog.accept();
  });

  it('should refresh properly', function() {
    var username = element(by.model('username'));
    var name = element(by.binding('username'));
    username.clear();
    expect(name.getText()).toEqual('');

    browser.navigate().refresh();

    expect(name.getText()).toEqual('Anon');
  });

  // Back and forward do NOT work at the moment because of an issue
  // bootstrapping with Angular
  /*
  it('should navigate back and forward properly', function() {
    browser.get('index.html#/repeater');
    expect(browser.getCurrentUrl()).
      toEqual(env.baseUrl+'/ng1/index.html#/repeater');

    browser.navigate().back();
    expect(browser.getCurrentUrl()).
      toEqual(env.baseUrl+'/ng1/index.html#/form');

    browser.navigate().forward();
    expect(browser.getCurrentUrl()).
      toEqual(env.baseUrl+'/ng1/index.html#/repeater');
  });
  */

  it('should navigate back and forward properly from link', function() {
    element(by.linkText('repeater')).click();
    expect(browser.getCurrentUrl()).
      toEqual(env.baseUrl + '/ng1/index.html#/repeater');

    browser.navigate().back();
    expect(browser.getCurrentUrl()).
      toEqual(env.baseUrl + '/ng1/index.html#/form');

    browser.navigate().forward();
    expect(browser.getCurrentUrl()).
      toEqual(env.baseUrl + '/ng1/index.html#/repeater');
  });
});
