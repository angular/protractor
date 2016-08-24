describe('check if plugin setup ran', function() {
  it('should have set protractor.__BASIC_PLUGIN_RAN', function() {
    expect(protractor.__BASIC_PLUGIN_RAN_SETUP).toBe(true);
  });

  it('should have set protractor.__INLINE_PLUGIN_RAN', function() {
    expect(protractor.__INLINE_PLUGIN_RAN).toBe(true);
  });
});
