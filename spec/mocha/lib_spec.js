// Use the external Chai As Promised to deal with resolving promises in
// expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

// Chai's expect().to.exist style makes default jshint unhappy.
// jshint expr:true

describe('no protractor at all', function() {
  it('should still do normal tests', function() {
    expect(true).to.equal(true);
  });
});

describe('protractor library', function() {
  it.skip('should be able to skip tests', function() {
    expect(true).to.equal(false);
  });

  it('should expose the correct global variables', function() {
    expect(protractor).to.exist;
    expect(browser).to.exist;
    expect(by).to.exist;
    expect(element).to.exist;
    expect($).to.exist;
  });

  it('should wrap webdriver', function() {
    // Mocha will report the spec as slow if it goes over this time in ms.
    this.slow(6000);
    browser.get('index.html');
    expect(browser.getTitle()).to.eventually.equal('My AngularJS App');
  });

  describe('with async tests', function() {
    var finished = false;

    it('should wait for async operations to finish', function() {
      browser.get('index.html').then(function() { finished = true; });
    });

    after('verify mocha waited', function() {
      if(!finished) { throw new Error('Mocha did not wait for async!'); }
    });
  });
});
