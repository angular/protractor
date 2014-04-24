describe('using an ActionSequence', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('should drag and drop', function() {
    var sliderBar = element(by.name('points'));

    expect(sliderBar.getAttribute('value')).toEqual('1');

    browser.actions().
        dragAndDrop(sliderBar, {x: 400, y: 20}).
        perform();

    expect(sliderBar.getAttribute('value')).toEqual('10');
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

  it('should navigate back and forward properly', function() {
    var port =  process.env.HTTP_PORT || '8000';
    browser.get('index.html#/repeater');
    expect(browser.getCurrentUrl()).
      toEqual('http://localhost:'+port+'/index.html#/repeater');

    browser.navigate().back();
    expect(browser.getCurrentUrl()).
      toEqual('http://localhost:'+port+'/index.html#/form');
    
    browser.navigate().forward();
    expect(browser.getCurrentUrl()).
      toEqual('http://localhost:'+port+'/index.html#/repeater'); 
  });

  it('should navigate back and forward properly from link', function() {
    var port =  process.env.HTTP_PORT || '8000';
    element(by.linkText('repeater')).click();
    expect(browser.getCurrentUrl()).
      toEqual('http://localhost:'+port+'/index.html#/repeater');

    browser.navigate().back();
    expect(browser.getCurrentUrl()).
      toEqual('http://localhost:'+port+'/index.html#/form');
    
    browser.navigate().forward();
    expect(browser.getCurrentUrl()).
      toEqual('http://localhost:'+port+'/index.html#/repeater'); 
  });
});
