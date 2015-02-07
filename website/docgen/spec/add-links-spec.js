var linksProcessorFn = require('../processors/add-links');
var _ = require('lodash');


describe('add-links', function() {
  var linksProcessor;

  beforeEach(function() {
    linksProcessor = linksProcessorFn();
  });

  var addLinks = function(docs) {
    linksProcessor.$process(docs);
  };

  it('should add protractor link', function() {
    var doc = {
      fileName: 'protractor',
      fileInfo: { filePath: '' },
      startingLine: 123
    };
    addLinks([doc]);
    expect(doc.sourceLink).toBe('https://github.com/angular/protractor/' +
        'blob/' + require('../../../package.json').version + '/lib/' +
        'protractor.js#L123');
  });

  it('should add webdriver link', function() {
    var doc = {
      fileName: 'webdriver',
      fileInfo: { filePath: 'selenium-webdriver' },
      startingLine: 123
    };
    addLinks([doc]);
    expect(doc.sourceLink).toBe('https://github.com/SeleniumHQ/selenium/' +
        'blob/master/javascript/webdriver/webdriver.js#L123');
  });

  it('should add links to types', function() {
    var docWithFunction = {
      typeExpression: 'function(webdriver.WebElement, number)',
      fileName: 'protractor',
      fileInfo: { filePath: '' },
      startingLine: 123,
      returns: {
        tagDef: {
          name: 'returns',
          aliases: ['return'],
          canHaveType: true
        },
        tagName: 'return',
        description: '',
        startingLine: 119,
        typeExpression: 'webdriver.WebElement',
        type: {
          type: 'NameExpression',
          name: 'webdriver.WebElement'
        },
        typeList: ['webdriver.WebElement']
      },
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
        },
        {
          tagDef: {
            name: 'param',
            multi: true,
            docProperty: 'params',
            canHaveName: true,
            canHaveType: true
          },
          tagName: 'param',
          description: '',
          startingLine: 171,
          typeExpression: 'Protractor',
          type: {
            type: 'NameExpression',
            name: 'Protractor'
          },
          typeList: ['Protractor'],
          name: 'ptor'
        }
      ]
    };

    // Given a type and a function.
    var docs = [
      {
        name: 'webdriver.WebElement',
        fileName: 'webdriver',
        fileInfo: { filePath: 'selenium-webdriver' },
        startingLine: 123
      },
      docWithFunction,
      {
        name: 'Protractor',
        fileName: 'protractor',
        fileInfo: { filePath: '' },
        startingLine: 3
      }
    ];

    // When you add links.
    addLinks(docs);

    // Then ensure the link was added.
    var getDesc = function(index) {
      return docs[1].params[index].paramString;
    };
    expect(getDesc(0)).toBe(
        'function([webdriver.WebElement](webdriver.WebElement), number)');
    expect(getDesc(1)).toBe('[Protractor](Protractor)');

    expect(docs[1].returnString).toBe('[webdriver.WebElement](webdriver.WebElement)');
  });

  it('should add @link links', function() {
    // Given a doc with a @link annotation.
    var docs = [
      {
        name: 'webdriver.WebElement',
        fileName: 'webdriver',
        fileInfo: { filePath: 'selenium-webdriver' },
        startingLine: 123
      },
      {
        name: 'element.findElements',
        description: 'A promise that {@link webdriver.WebElement}s',
        fileName: 'protractor',
        fileInfo: { filePath: '' },
        startingLine: 3,
        returns: {
          tagDef: {
            name: 'returns',
            aliases: ['return'],
            canHaveType: true
          },
          tagName: 'return',
          description: 'A promise located {@link webdriver.WebElement}s.',
          startingLine: 119,
          typeExpression: 'webdriver.WebElement',
          type: {
            type: 'NameExpression',
            name: 'webdriver.WebElement'
          },
          typeList: ['webdriver.WebElement']
        }
      }
    ];

    // When you add links.
    addLinks(docs);

    // Then ensure a link was added to the type.
    expect(docs[1].description).
        toBe('A promise that [webdriver.WebElement](webdriver.WebElement)s');
    expect(docs[1].returns.description).
        toBe('A promise located [webdriver.WebElement](webdriver.WebElement)s.');
  });

  it('should handle {@link type desc} links', function() {
    // Given a doc with a @link annotation.
    var docs = [
      {
        name: 'webdriver.WebElement',
        fileName: 'webdriver',
        fileInfo: { filePath: 'selenium-webdriver' },
        startingLine: 123
      },
      {
        name: 'element.findElements',
        description: 'A promise that {@link webdriver.WebElement Web Elements}',
        fileName: 'protractor',
        fileInfo: { filePath: '' },
        startingLine: 3,
        returns: {
          tagDef: {
            name: 'returns',
            aliases: ['return'],
            canHaveType: true
          },
          tagName: 'return',
          description: 'A promise located {@link webdriver.NOT_A_THING Web Elements}.',
          startingLine: 119,
          typeExpression: 'webdriver.WebElement',
          type: {
            type: 'NameExpression',
            name: 'webdriver.WebElement'
          },
          typeList: ['webdriver.WebElement']
        }
      }
    ];

    // When you add links.
    addLinks(docs);

    // Then ensure a link was added to the type.
    expect(docs[1].description).
        toBe('A promise that [Web Elements](webdriver.WebElement)');
    expect(docs[1].returns.description).
        toBe('A promise located Web Elements.');
  });

  it('should handle "#" in @link links', function() {
    // Given a doc with a @link annotation.
    var docs = [
      {
        name: 'webdriver.WebDriver',
        fileName: 'webdriver',
        fileInfo: { filePath: 'selenium-webdriver' },
        startingLine: 123
      },
      {
        name: 'webdriver.WebElement',
        description: 'A promise that {@link #WebDriver Web Drivers}',
        fileName: 'webdriver',
        fileInfo: { filePath: 'selenium-webdriver' },
        startingLine: 3,
        returns: {
          tagDef: {
            name: 'returns',
            aliases: ['return'],
            canHaveType: true
          },
          tagName: 'return',
          description: 'A promise located {@link webdriver#WebElement Web Elements}.',
          startingLine: 119,
          typeExpression: 'webdriver.WebElement',
          type: {
            type: 'NameExpression',
            name: 'webdriver.WebElement'
          },
          typeList: ['webdriver.WebElement']
        }
      }
    ];

    // When you add links.
    addLinks(docs);

    // Then ensure a link was added to the type.
    expect(docs[1].description).
        toBe('A promise that [Web Drivers](webdriver.WebDriver)');
    expect(docs[1].returns.description).
        toBe('A promise located [Web Elements](webdriver.WebElement).');
  });

  it('should remove extraneous chatacters from @link links', function() {
    // Given a doc with a @link annotation.
    var docs = [
      {
        name: 'webdriver.WebElement',
        fileName: 'webdriver',
        fileInfo: { filePath: 'selenium-webdriver' },
        startingLine: 123
      },
      {
        name: 'element.findElements',
        description: 'A promise that {@link webdriver.WebElement()}',
        fileName: 'protractor',
        fileInfo: { filePath: '' },
        startingLine: 3,
        returns: {
          tagDef: {
            name: 'returns',
            aliases: ['return'],
            canHaveType: true
          },
          tagName: 'return',
          description: 'A promise located {@link webdriver.WebElement    Web Elements }.',
          startingLine: 119,
          typeExpression: 'webdriver.WebElement',
          type: {
            type: 'NameExpression',
            name: 'webdriver.WebElement'
          },
          typeList: ['webdriver.WebElement']
        }
      }
    ];

    // When you add links.
    addLinks(docs);

    // Then ensure a link was added to the type.
    expect(docs[1].description).
        toBe('A promise that [webdriver.WebElement()](webdriver.WebElement)');
    expect(docs[1].returns.description).
        toBe('A promise located [Web Elements](webdriver.WebElement).');

  });
});
