describe('custom matchers', function() {
  beforeEach(function () {
    browser.get('index.html#/animation');
  });

  beforeEach(function() {
    jasmine.addMatchers({
      toHaveText: function() {
        return {
          compare: function(actual, expected) {
            return {
              pass: actual.getText().then(function(actual) {
                return actual === expected;
              })
            };
          }
        };
      }
    });
  });

  describe('on an element that is not in the DOM', function() {
    var toggleNode;

    beforeEach(function() {
      $('#checkbox').click();
      toggleNode = $('#toggledNode');
    });

    it('should work when called one time', function() {
      $('#checkbox').click();
      expect(toggleNode).toHaveText('I exist!');
    });

    it('should work when called two times', function() {
      $('#checkbox').click();
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
    });

    it('should work when called three times', function() {
      $('#checkbox').click();
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
    });

    it('should work when called four times', function() {
      $('#checkbox').click();
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
    });

    it('should work when called five times', function() {
      $('#checkbox').click();
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
      expect(toggleNode).toHaveText('I exist!');
    });

  });


});
