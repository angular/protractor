
describe('handling timeout errors', function() {

  it('should call error handler on a timeout', function() {
    browser.get('dummyUrl', 1).then(function() {
      throw 'did not handle error';
    }, function(err) {
      expect(err).toBeDefined();
    });
  });
});
