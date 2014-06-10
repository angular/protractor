var locatorFinder = require('../../lib/locator-finder.js');

describe('Locator finder', function() {

  describe('Find by css', function() {
    it('should find by css', function() {
      var locators = {
        byCss: {
          nodeName: 'input',
          type: 'text',
          'ng-model': 'yourName',
          placeholder: 'Enter a name here',
          class: 'ng-pristine ng-valid'
        }
      };

      var list = locatorFinder.buildLocatorList(locators);
      expect(list).toEqual([
        {
          name: 'byCss',
          locator: 'by.css(\'input[type="text"]\')',
          countExpression: 'element.all(by.css(\'input[type="text"]\')).count()'
        },
        {
          name: 'byCss',
          locator: 'by.css(\'input[ng-model="yourName"]\')',
          countExpression: 'element.all(by.css(\'input[ng-model="yourName"]\'))' +
              '.count()'
        },
        {
          name: 'byCss',
          locator: 'by.css(\'input[placeholder="Enter a name here"]\')',
          countExpression: 'element.all(by.css(\'input[placeholder="Enter a ' +
              'name here"]\')).count()'
        }
      ]);
    });
  });
});
