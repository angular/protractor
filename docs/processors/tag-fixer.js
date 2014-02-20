var _ = require('lodash');


/**
 * Find the name of the function.
 */
var findName = function(doc) {
  // Skip if the function has a name.
  if (doc.name || !doc.fnDef) {
    return;
  }

  // Remove text after =.
  var name = doc.fnDef.line.replace(/\s*=.*/, '');
  // Remove space + var prefix.
  name = name.replace(/\s*(var)?\s*/, '');

  doc.name = name;
};

/**
 * Replace the new lines in an object property.
 * @param {!Object} obj Object with properties.
 * @param {string} prop Property name.
 */
var replaceNewLines = function(obj, prop) {
  if (obj) {
    obj[prop] = (obj[prop] || '').replace(/\n\s+/, ' ');
  }
};

/**
 * Escape the < > characters from the param or return type.
 * @param {!Object} type Parsed type.
 */
var escapeTypeDescriptions = function(type) {
  if (type && type.description) {
    type.description = _.escape(type.description);
  }
};

/**
 * Remove new lines from the params.
 * @param {!Object} doc Document with the tag.
 */
var fixParams = function(doc) {
  // Remove duplicates.
  if (doc.params) {
    doc.params = _.uniq(doc.params, 'name');
    _.each(doc.params, function(param) {
      replaceNewLines(param, 'description');
      escapeTypeDescriptions(param.type);
    });
  }

  // Replace new lines in the return and params descriptions.
  var returns = doc.returns;
  if (returns) {
    replaceNewLines(returns, 'description');
    escapeTypeDescriptions(returns.type);
  }
};

/**
 * Parse the example and the content.
 * @param {!Object} doc Document with the tag.
 */
var parseExampleAndContent = function(doc) {
  var description = doc.description || '',
      index = description.indexOf('Example:');

  if (index >= 0) {
    doc.example = description.substring(index).replace('Example:\n', '');
    doc.description = description.substring(0, index);
  }
};

var addLinkToSource = function(doc) {
  doc.sourceLink = 'https://github.com/angular/protractor/blob/master/' +
      doc.file + '#L' + doc.startingLine;

//  'https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#62'
};

/**
 * Generate a unique file name with an index used to concatenate.
 */
var fileName = function(doc, i) {
  var index = '00' + (i++);
  index = index.substring(index.length - 3);
  return 'partials/' + doc.fileName + index + '.md';
};

/**
 * Remove docs that should not be in the documentation.
 */
var filterDocs = function(docs) {
  return _.reject(docs, function(doc) {
    // Skip functions starting with 'exports'.
    if (/^exports/.test(doc.name)) {
      return true;
    }

    // Exclude docs with tags.
    if (doc.tags) {
      var tags = _.pluck(doc.tags.tags, 'title');
      return _.intersection(tags, excludedTags).length;
    }
  });
};

var excludedTags = ['private', 'type'];
var i = 1;

module.exports = {
  name: 'tag-fixer',
  description: 'Do some processing before rendering',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    docs.forEach(function(doc) {
      findName(doc);
      fixParams(doc);
      parseExampleAndContent(doc);
      addLinkToSource(doc);

      doc.outputPath = fileName(doc, i++);
    });

    docs = filterDocs(docs);

    return docs;
  }
};
