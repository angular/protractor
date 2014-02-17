var tagFixer = require('../processors/tag-fixer');
var expect = require('expect.js');

describe('tag fixer', function () {
  var doc;

  beforeEach(function () {
    doc = {
      file: 'lib/protractor.js',
      content: 'element.all is used for operations on an array of elements (as opposed\nto a single element).\n\nExample:\n    var lis = element.all(by.css(\'li\'));\n    browser.get(\'myurl\');\n    expect(lis.count()).toEqual(4);\n\n@name element.all\n@param {webdriver.Locator} locator\n@return {ElementArrayFinder}',
      fileName: 'protractor',
      name: 'element.all',
      description: 'element.all is used for operations on an array of elements (as opposed to a single element).\n\nExample:\n    var lis = element.all(by.css(\'li\'));\n    browser.get(\'myurl\');\n    expect(lis.count()).toEqual(4);',
      fnDef: {line: '  var element = function(locator) {', lineNumber: 165}
    };
  });

  it('should parse example and desc', function () {
    tagFixer.process([doc]);

    expect(doc.example).to.equal(
        '    var lis = element.all(by.css(\'li\'));\n' +
        '    browser.get(\'myurl\');\n' +
        '    expect(lis.count()).toEqual(4);'
    );
    expect(doc.desc).to.equal('element.all is used for operations on an ' +
        'array of elements (as opposed to a single element).\n\n');
  });

  it('should find name in fnDef', function() {
    // Remove the name.
    doc.name = null;
    tagFixer.process([doc]);

    expect(doc.name).to.equal('element');
  });
});
