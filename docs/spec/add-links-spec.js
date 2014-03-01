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
    // Given a type and a function.
    var docs = [
      {
        name: 'webdriver.WebElement',
        fileName: 'webdriver',
        startingLine: 123
      },
      {
        name: 'theFunction',
        fileName: 'protractor',
        startingLine: 123,
        params: [
          newType('!webdriver.WebElement'),
          newType('webdriver.WebElement'),
          newType(_.escape('!Array.<webdriver.WebElement>')),
          newType(_.escape('function(webdriver.WebElement, number)')),
          newType(_.escape('function(webdriver.WebElement)')),
          newType(_.escape('!function(!webdriver.WebElement)'))
        ],
        returns: {
          type: {
            description: '!webdriver.WebElement'
          }
        }
      }
    ];

    // When you add links.
    addLinks(docs);

    // Then ensure the link was added.
    var getDesc = function(index) {
      return docs[1].params[index].type.description;
    };
    expect(getDesc(0)).toBe(
        '&#33;[webdriver.WebElement](#webdriverwebelement)');
    expect(getDesc(1)).toBe(
        '[webdriver.WebElement](#webdriverwebelement)');
    expect(getDesc(2)).toBe(
        '!Array.&lt;[webdriver.WebElement](#webdriverwebelement)&gt;');
    expect(getDesc(3)).toBe(
        'function([webdriver.WebElement](#webdriverwebelement), number)');
    expect(getDesc(4)).toBe(
        'function([webdriver.WebElement](#webdriverwebelement))');
    expect(getDesc(5)).toBe(
        '!function(&#33;[webdriver.WebElement](#webdriverwebelement))');

    expect(docs[1].returns.type.description).
        toBe('&#33;[webdriver.WebElement](#webdriverwebelement)');
  });
});
