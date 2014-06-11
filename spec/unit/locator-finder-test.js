var locatorFinder = require('../../lib/locator-finder.js');

describe('Locator finder', function() {

  describe('Find by css', function() {
    var expectByCss = function(expectedBy, actual) {
      var locator = 'by.css(\'' + expectedBy + '\')';

      expect({
        name: 'byCss',
        locator: locator,
        countExpression: 'element.all(' + locator + ').count()'
      }).toEqual(actual);
    };

    it('should generate a locator for each attribute', function() {
      // Given an element with multiple attributes.
      var locators = {
        byCss: {
          nodeName: 'input',
          type: 'text',
          'ng-model': 'yourName',
          placeholder: 'Enter a name here',
          class: 'ng-pristine ng-valid'
        }
      };

      // When you get the locator list.
      var list = locatorFinder.buildLocatorList(locators);

      // Then ensure there is a locator for each attribute.
      expect(list.length).toBe(3);
      expectByCss('input[type="text"]', list[0]);
      expectByCss('input[ng-model="yourName"]', list[1]);
      expectByCss('input[placeholder="Enter a name here"]',
          list[2]);
    });

    it('should use classes and ignore ng classes', function() {
      // Given an element with classes and ng classes.
      var locators = {
        byCss: {
          nodeName: 'input',
          type: 'text',
          class: 'ng-pristine ng-valid btn btn-primary'
        }
      };

      // When you get the locator list.
      var list = locatorFinder.buildLocatorList(locators);

      // Then ensure there is a locator for each class and the ng classes are
      // ignored.
      expect(list.length).toBe(3);
      expectByCss('input[type="text"]', list[0]);
      expectByCss('input.btn.btn-primary', list[1]);
      expectByCss('.btn.btn-primary', list[2]);
    });
  });
})
;
