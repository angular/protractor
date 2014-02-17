var _ = require('lodash');

/**
 * Replace the new lines in an object property.
 * @param {!Object} obj Object with properties.
 * @param {string} prop Property name.
 */
var replaceNewLines = function (obj, prop) {
  if (obj) {
    obj[prop] = (obj[prop] || '').replace(/\n\s+/, ' ');
  }
};

/**
 * Escape the < > characters from the param or return type.
 * @param {!Object} type Parsed type.
 */
var escapeTypeDescriptions = function (type) {
  if (type && type.description) {
    type.description =
        type.description.replace('<', '&lt;').replace('>', '&gt;');
  }
};

/**
 * Remove new lines from the params.
 * @param {!Object} doc Document with the tag.
 */
var fixParams = function (doc) {
  // Remove duplicates.
  var params = doc.params,
      returns = doc.returns;

  if (params) {
    doc.params = _.uniq(params, 'name');
  }

  // Replace new lines in the return and params descriptions.
  if (returns) {
    replaceNewLines(returns, 'description');
    escapeTypeDescriptions(returns.type);
  }

  _.each(params, function (param) {
    replaceNewLines(param, 'description');
    escapeTypeDescriptions(param.type);
  });
};

/**
 * Parse the example and the content.
 * @param {!Object} doc Document with the tag.
 */
var parseExampleAndContent = function (doc) {
  var description = doc.description || '',
      index = description.indexOf('Example:');

  if (index >= 0) {
    doc.example = description.substring(index).replace('Example:\n', '');
    doc.desc = description.substring(0, index);
  }
};

var addLinkToSource = function (doc) {
  doc.sourceLink = 'https://github.com/angular/protractor/blob/master/' +
      doc.file + '#L' + doc.startingLine;
};

module.exports = {
  name: 'tag-fixer',
  description: 'Do some processing before rendering',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function (config) {
  },
  process: function (docs) {
    var i = 1;
    docs.forEach(function (doc) {
      fixParams(doc);
      parseExampleAndContent(doc);
      addLinkToSource(doc);

      doc.outputPath = 'partials/' + doc.fileName + (i++) + '.md'
    });
  }
};
