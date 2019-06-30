describe('check if plugin setup ran', () => {
  it('should have set protractor.__BASIC_PLUGIN_RAN', () => {
    expect(protractor.__BASIC_PLUGIN_RAN_SETUP).toBe(true);
  });

  it('should have set protractor.__INLINE_PLUGIN_RAN', () => {
    expect(protractor.__INLINE_PLUGIN_RAN).toBe(true);
  });
});
