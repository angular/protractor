describe('configuration with no globals', () => {
  const URL = '/ng2/#/async';

  it('should have objects belonging to protractor namespace', () => {
    expect(typeof protractor).toEqual('object');
    expect(typeof protractor.browser).toEqual('object');
    expect(typeof protractor.$).toEqual('function');
    expect(typeof protractor.$$).toEqual('function');
    expect(typeof protractor.element).toEqual('function');
    expect(typeof protractor.by).toEqual('object');
    expect(typeof protractor.By).toEqual('object');
  });

  it('should not have other globals', () => {
    expect(typeof browser).toEqual('undefined');
    expect(typeof $).toEqual('undefined');
    expect(typeof $$).toEqual('undefined');
    expect(typeof element).toEqual('undefined');
    expect(typeof by).toEqual('undefined');
    expect(typeof By).toEqual('undefined');
  });

  it('should be able to use methods under the protractor namespace', async () => {
    await protractor.browser.get(URL);
    const increment = protractor.$('#increment');
    expect(typeof increment).toEqual('object');
    await increment.$('.action').click();
    expect(await increment.$('.val').getText()).toEqual('1');
  });
});
