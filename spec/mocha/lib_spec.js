// Use the external Chai As Promised to deal with resolving promises in
// expectations.
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = chai.expect;

// Chai's expect().to.exist style makes default jshint unhappy.
// jshint expr:true

describe('no protractor at all', () => {
  it('should still do normal tests', () => {
    expect(true).to.equal(true);
  });
});

describe('protractor library', () => {
  it.skip('should be able to skip tests', () => {
    expect(true).to.equal(false);
  });

  it('should expose the correct global variables', () => {
    expect(protractor).to.exist;
    expect(browser).to.exist;
    expect(by).to.exist;
    expect(element).to.exist;
    expect($).to.exist;
  });

  it('should wrap webdriver', async function() {
    // Mocha will report the spec as slow if it goes over this time in ms.
    this.slow(6000);
    
    await browser.get('index.html');
    expect(await browser.getTitle()).to.equal('My AngularJS App');
  });

  describe('with async tests', () => {
    let finished = false;

    it('should wait for async operations to finish', async() => {
      await browser.get('index.html');
      finished = true;
    });

    after('verify mocha waited', () => {
      if(!finished) {
        throw new Error('Mocha did not wait for async!');
      }
    });
  });
});
