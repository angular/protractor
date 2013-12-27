var expect = require('expect.js');

describe('no protractor at all', function() {
  it('should still do normal tests', function() {
    expect(true).to.eql(true);
  });
});

describe('protractor library', function() {
  it('should expose the correct global variables', function() {
    expect(protractor).not.to.be(undefined);
    expect(browser).not.to.be(undefined);
    expect(by).not.to.be(undefined);
    expect(element).not.to.be(undefined);
    expect($).not.to.be(undefined);
  });

  it('should wrap webdriver', function() {
    browser.get('index.html');
    browser.getTitle().then(function(text) {
      expect(text).to.eql('My AngularJS App');
    });
  });
});
