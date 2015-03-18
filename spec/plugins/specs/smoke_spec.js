describe('check if plugin setup ran', function() {
  it('should have set protractor.__BASIC_PLUGIN_RAN', function() {
    expect(protractor.__BASIC_PLUGIN_RAN).toBe(true);
  });
});
