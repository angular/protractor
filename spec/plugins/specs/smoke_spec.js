describe('check if plugin setup ran', function() {
  it('should have set protractor.__BASIC_PLUGIN_RAN_*', function() {
    expect(protractor.__BASIC_PLUGIN_RAN_SETUP).toBe(true);
    expect(protractor.__BASIC_PLUGIN_RAN_ON_PREPARE).toBe(true);
  });
});
