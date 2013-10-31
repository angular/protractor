var util = require('util');

describe('finding elements when ng-app is nested', function() {

  describe('in forms', function() {

    beforeEach(function() {
      browser.get('alt_root_index.html#/form');
    });

    it('should find an element by binding', function() {
      var greeting = element(by.binding('{{greeting}}'));

      expect(greeting.getText()).toEqual('Hiya');
    });

    it('should find elements outside of angular', function() {
      var outside = element(by.id('outside-ng'));
      var inside = element(by.id('inside-ng'));

      expect(outside.getText()).toEqual('{{1 + 2}}');
      expect(inside.getText()).toEqual('3');
    });
  });
});
