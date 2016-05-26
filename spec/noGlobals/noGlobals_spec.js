describe('configuration with no globals', function() {
  var URL = '/ng2/#/async';

  it('should have objects belonging to protractor namespace', function() {
    expect(typeof protractor).toEqual('object');
    expect(typeof protractor.browser).toEqual('object');
    expect(typeof protractor.$).toEqual('function');
    expect(typeof protractor.$$).toEqual('function');
    expect(typeof protractor.element).toEqual('function');
    expect(typeof protractor.by).toEqual('object');
    expect(typeof protractor.By).toEqual('object');
  });

  it('should not have other globals', function() {
    expect(typeof browser).toEqual('undefined');
    expect(typeof $).toEqual('undefined');
    expect(typeof $$).toEqual('undefined');
    expect(typeof element).toEqual('undefined');
    expect(typeof by).toEqual('undefined');
    expect(typeof By).toEqual('undefined');
  });

  it('should be able to use methods under the protractor namespace', function() {
    protractor.browser.get(URL);
    var increment = protractor.$('#increment');
    expect(typeof increment).toEqual('object');
    increment.$('.action').click();
    expect(increment.$('.val').getText()).toEqual('1');
  });
});
