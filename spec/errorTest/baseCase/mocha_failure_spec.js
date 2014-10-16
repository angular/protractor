// Use the external Chai As Promised to deal with resolving promises in
// expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('protractor library', function() {
  it('should fail', function() {
    browser.get('index.html');
    expect(browser.getTitle()).to.eventually.equal('INTENTIONALLY INCORRECT');
  });
});
