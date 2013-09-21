describe('tests that use the shortcuts set by the onPrepare in the config',
    function() {
  beforeEach(function() {
    // ptor is in the globals thanks to the onPrepare callback function in the
    // config.
    ptor.get('app/index.html#/form');
  });

  it('should find an element using elem instead of findElement', function() {
    var greeting = ptor.elem(protractor.By.binding('{{greeting}}'));
    expect(greeting.getText()).toEqual('Hiya');
  });

  it('should find an element using the global by function', function() {
    var greeting = ptor.elem(by.binding('{{greeting}}'));
    expect(greeting.getText()).toEqual('Hiya');
  });
});
