describe('check if plugin setup ran', () => {
  it('should have set protractor.__BASIC_PLUGIN_RAN', () =>  {
    expect(protractor.__BASIC_PLUGIN_RAN_SETUP).toBe(true);
  });

  it('should run multiple tests which fail', () =>  {
    expect(true).toBe(false);
  });
});
