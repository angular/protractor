var util = require('util');

describe('finding elements when ng-app is nested', function() {
  var ptor;

  describe('in forms', function() {
    ptor = protractor.getInstance();

    beforeEach(function() {
      ptor.get('app/alt_root_index.html#/form');
    });

    it('should find an element by binding', function() {
      var greeting = ptor.findElement(protractor.By.binding('{{greeting}}'));

      expect(greeting.getText()).toEqual('Hiya');
    });

    it('should find elements outside of angular', function() {
      var outside = ptor.findElement(protractor.By.id('outside-ng'));
      var inside = ptor.findElement(protractor.By.id('inside-ng'));

      expect(outside.getText()).toEqual('{{1 + 2}}');
      expect(inside.getText()).toEqual('3');
    });
  });
});
