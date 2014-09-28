var tagFixerFn = require('../processors/tag-fixer');
var elementArrayFinder = require('./element-array-finder.json');
var elementAll = require('./element-array-finder-all.json');
var _ = require('lodash');

describe('tag fixer', function() {
  var classMethodStatement, constructorStatement, docs, tagFixer;

  beforeEach(function() {
    tagFixer = tagFixerFn();
  });

  beforeEach(function() {
    constructorStatement = _.cloneDeep(elementArrayFinder);
    classMethodStatement = _.cloneDeep(elementAll);

    docs = [constructorStatement, classMethodStatement];
  });

  it('should find name for method declaration', function() {
    // When you process the docs.
    tagFixer.$process(docs);

    // Then ensure the name was parsed.
    expect(classMethodStatement.name).toBe('ElementArrayFinder.prototype.all');
  });

  it('should find name for constructor declaration', function() {
    // When you process the docs.
    tagFixer.$process(docs);

    // Then ensure the name was parsed.
    expect(constructorStatement.name).toBe('ElementArrayFinder');
  });

  it('should not override name', function() {
    // Given that the doc has a @name.
    classMethodStatement.name = 'name1';
    constructorStatement.name = 'name2';

    // When you process the docs.
    tagFixer.$process(docs);

    // Then ensure the name was not changed.
    expect(classMethodStatement.name).toBe('name1');
    expect(constructorStatement.name).toBe('name2');
  });
});
