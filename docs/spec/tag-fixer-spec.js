var tagFixer = require('../processors/tag-fixer');

describe('tag fixer', function() {
  var expressionDoc, declarationDoc, docs;

  beforeEach(function() {
    expressionDoc = {
      code: {
        node: {
          expression: {
            left: {
              object: {
                name: 'element'
              },
              property: {
                name: 'all'
              }
            }
          }
        }
      },
      tags: {
        description: 'element description'
      }
    };

    declarationDoc = {
      code: {
        node: {
          declarations: [
            {
              id: {
                name: 'element'
              }
            }
          ]
        }
      },
      tags: {
        description: 'element description'
      }
    };

    docs = [expressionDoc, declarationDoc];
  });

  it('should find name in code expression', function() {
    // When you process the docs.
    tagFixer.process(docs);

    // Then ensure the name was parsed.
    expect(expressionDoc.name).toBe('element.all');
  });

  it('should find name in code declaration', function() {
    // When you process the docs.
    tagFixer.process(docs);

    // Then ensure the name was parsed.
    expect(declarationDoc.name).toBe('element');
  });

  it('should not override name', function() {
    // Given that the doc has a @name.
    expressionDoc.name = 'name1';
    declarationDoc.name = 'name2';

    // When you process the docs.
    tagFixer.process(docs);

    // Then ensure the name was not changed.
    expect(expressionDoc.name).toBe('name1');
    expect(declarationDoc.name).toBe('name2');
  });
});
