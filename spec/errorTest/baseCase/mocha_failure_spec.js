// Use the external Chai As Promised to deal with resolving promises in
// expectations.
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('protractor library', () => {
  it('should fail', async () => {
    await browser.get('index.html');
    expect(await browser.getTitle()).to.equal('INTENTIONALLY INCORRECT');
  });
});
