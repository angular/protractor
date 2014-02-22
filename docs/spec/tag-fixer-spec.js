var tagFixer = require('../processors/tag-fixer');
var expect = require('expect.js');

describe('tag fixer', function() {
  var doc;

  beforeEach(function() {
    doc = {
      file: 'lib/protractor.js',
      content: 'element.all is used for operations on an array of elements (as opposed\nto a single element).\n\nExample:\n    var lis = element.all(by.css(\'li\'));\n    browser.get(\'myurl\');\n    expect(lis.count()).toEqual(4);\n\n@name element.all\n@param {webdriver.Locator} locator\n@return {ElementArrayFinder}',
      fileName: 'protractor',
      name: 'element.all',
      description: 'element.all is used for operations on an array of elements (as opposed to a single element).\n\nExample:\n    var lis = element.all(by.css(\'li\'));\n    browser.get(\'myurl\');\n    expect(lis.count()).toEqual(4);',
      fnDef: {line: '  var element = function(locator) {', lineNumber: 165},
      params: [
        {
          name: 'script',
          description: 'The script to execute.',
          type: {
            description: '!(string|Function|Array.<webdriver.Locator>)',
            optional: false,
            typeList: []
          }
        },
        {
          name: 'var_args',
          description: 'The arguments to pass to the script.',
          type: {
            description: '...*',
            optional: false,
            typeList: []
          }
        }
      ],
      returns: {
        type: {
          description: '!webdriver.promise.Promise.<!Array.<!webdriver.logging.Entry>>',
          optional: false,
          typeList: ['!webdriver.promise.Promise.<!Array.<!webdriver.logging.Entry>>']
        },
        description: 'A promise that will resolve to a list of log entries for the specified\n  type.' }
    };
  });

  it('should find name in fnDef', function() {
    // Remove the name.
    doc.name = null;
    tagFixer.process([doc]);

    expect(doc.name).to.equal('element');
  });

  it('should not override name', function() {
    tagFixer.process([doc]);
    expect(doc.name).to.equal('element.all');
  });

  it('should escape params', function() {
    tagFixer.process([doc]);
    expect(doc.params[0].type.description).to.equal('!(string|Function|Array.&lt;webdriver.Locator&gt;)');
    expect(doc.params[1].type.description).to.equal('...*');
  });

  it('should escape returns', function() {
    tagFixer.process([doc]);
    expect(doc.returns.type.description).to.equal('!webdriver.promise.Promise.&lt;!Array.&lt;!webdriver.logging.Entry&gt;&gt;');
  });
});
