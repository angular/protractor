var linksProcessor = require('../processors/add-links');
var expect = require('expect.js');


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
    expect(doc.sourceLink).to.equal('https://github.com/angular/protractor/' +
        'blob/master/lib/protractor.js#L123');
  });

  it('should add webdriver link', function() {
    var doc = {
      fileName: 'webdriver',
      startingLine: 123
    };
    addLinks([doc]);
    expect(doc.sourceLink).to.equal('https://code.google.com/p/selenium/' +
        'source/browse/javascript/webdriver/webdriver.js#123');
  });

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
          {
            type: {
              description: '!webdriver.WebElement'
            }
          }
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
    expect(docs[1].params[0].type.description).
        to.equal('[!webdriver.WebElement](#webdriverwebelement)');
    expect(docs[1].returns.type.description).
        to.equal(12);
  });
});
