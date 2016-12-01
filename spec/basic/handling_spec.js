
describe('handling timeout errors', function() {

  it('should call error handler on a timeout', function() {
    browser.get('http://dummyUrl', 1).then(function() {
      throw 'did not handle error';
    }, function(err) {
      expect(err instanceof Error).toBeTruthy();
    });
  });
});
