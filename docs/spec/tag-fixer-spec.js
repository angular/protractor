var tagFixer = require('../processors/tag-fixer');

describe('tag fixer', function() {
  var doc;

  beforeEach(function() {
    doc = {
      name: 'element.all',
      fnDef: {line: '  var element = function(locator) {', lineNumber: 165},
      tags: {
        description: 'element'
      }
    };
  });

  it('should find name in fnDef', function() {
    // Remove the name.
    doc.name = null;
    tagFixer.process([doc]);

    expect(doc.name).toBe('element');
  });

  it('should not override name', function() {
    tagFixer.process([doc]);
    expect(doc.name).toBe('element.all');
  });
});
