var linksProcessor = require('../processors/add-links');
var _ = require('lodash');


describe('add-links', function() {
  var addLinks = function(docs) {
    linksProcessor.process(docs);
  };

  it('should add protractor link', function() {
    var doc = {
      fileName: 'protractor',
      startingLine: 123
    };
    addLinks([doc]);
    expect(doc.sourceLink).toBe('https://github.com/angular/protractor/' +
        'blob/master/lib/protractor.js#L123');
  });

  it('should add webdriver link', function() {
    var doc = {
      fileName: 'webdriver',
      startingLine: 123
    };
    addLinks([doc]);
    expect(doc.sourceLink).toBe('https://code.google.com/p/selenium/' +
        'source/browse/javascript/webdriver/webdriver.js#123');
  });

  var newType = function(description) {
    return {
      type: {
        description: description
      }
    };
  };

  it('should add links to types', function() {
    var docWithFunction = {
      typeExpression: 'function(webdriver.WebElement, number)',
      fileName: 'protractor',
      startingLine: 123,
      params: [
        {
          tagDef: {
            name: 'param',
            multi: true,
            docProperty: 'params',
            canHaveName: true,
            canHaveType: true
          },
          tagName: 'param',
          description: 'Map function that will be applied to each element.',
          startingLine: 396,
          typeExpression: 'function(webdriver.WebElement, number)',
          type: {
            type: 'FunctionType',
            params: [
              {type: 'NameExpression', name: 'webdriver.WebElement'},
              {type: 'NameExpression', name: 'number'}
            ]
          },
          typeList: ['function(webdriver.WebElement, number)'],
          name: 'mapFn'
        }
      ]
    };

    // Given a type and a function.
    var docs = [
      {
        name: 'webdriver.WebElement',
        fileName: 'webdriver',
        startingLine: 123
      },
      docWithFunction
    ];

    // When you add links.
    addLinks(docs);

    // Then ensure the link was added.
    var getDesc = function(index) {
      return docs[1].params[index].paramString;
    };
    expect(getDesc(0)).toBe(
        'function([webdriver.WebElement](#webdriverwebelement), number)');
  });
});
