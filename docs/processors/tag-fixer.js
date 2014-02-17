var _ = require('lodash');

/**
 * Replace the new lines in an object property.
 * @param {!Object} obj Object with properties.
 * @param {string} prop Property name.
 */
var replaceNewLines = function (obj, prop) {
  obj[prop] = (obj[prop] || '').replace(/\n\s+/, ' ');
};

/**
 * Remove new lines from the params.
 * @param {!Object} doc Document with the tag.
 */
var fixParams = function (doc) {
  // Remove duplicates.
  if (doc.params) {
    doc.params = _.uniq(doc.params, 'name');
  }

  // Replace new lines in the return and params descriptions.
  replaceNewLines(doc.returns, 'description');
  _.each(doc.params, function (param) {
    replaceNewLines(param, 'description');
  });
};

/**
 * Parse the example and the content.
 * @param {!Object} doc Document with the tag.
 */
var parseExampleAndContent = function (doc) {
  var description = doc.description || '',
      index = description.indexOf('Example:');

  if (doc.name == 'element.all') {
    console.log(doc);
  }

  if (index >= 0) {
    doc.example = description.substring(index).replace('Example:\n', '');
    doc.desc = description.substring(0, index);
  }
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

      doc.outputPath = 'partials/' + doc.fileName + (i++) + '.md'
    });
  }
};
