var tagFixer = require('../tag-fixer');
var expect = require('expect.js');

describe('tag fixer', function () {
  var doc, docs;

  beforeEach(function () {
    doc = {
      file: 'lib/protractor.js',
      content: 'element.all is used for operations on an array of elements (as opposed\nto a single element).\n\nExample:\n    var lis = element.all(by.css(\'li\'));\n    browser.get(\'myurl\');\n    expect(lis.count()).toEqual(4);\n\n@name element.all\n@param {webdriver.Locator} locator\n@return {ElementArrayFinder}',
      fileName: 'protractor',
      name: 'element.all',
      description: 'element.all is used for operations on an array of elements (as opposed to a single element).\n\nExample:\n    var lis = element.all(by.css(\'li\'));\n    browser.get(\'myurl\');\n    expect(lis.count()).toEqual(4);'
    };
    docs = [doc];
  });

  it('should parse example', function () {
    tagFixer.process(docs);

    expect(doc.example).to.equal(
        '    var lis = element.all(by.css(\'li\'));\n' +
        '    browser.get(\'myurl\');\n' +
        '    expect(lis.count()).toEqual(4);'
    );
    expect(doc.desc).to.equal('element.all is used for operations on an ' +
        'array of elements (as opposed\nto a single element).\n\n');
  });
});
