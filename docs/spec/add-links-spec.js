var linksProcessor = require('../processors/add-links');
var expect = require('expect.js');


describe('add-links', function() {
  var addLinks = function(doc) {
    linksProcessor.process([doc]);
  };

  it('should add protractor link', function() {
    var doc = {
      fileName: 'protractor',
      startingLine: 123
    };
    addLinks(doc);
    expect(doc.sourceLink).to.equal(
        'https://github.com/angular/protractor/blob/master/protractor#L123');
  });

  it('should add webdriver link', function() {
    var doc = {
      fileName: 'webdriver',
      startingLine: 123
    };
    addLinks(doc);
    expect(doc.sourceLink).to.equal(
        'https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#123');
  });
});
