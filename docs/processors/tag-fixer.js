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
 * Remove the duplicate param annotations. Go through the params and the return
 * annotations to replace the new lines and escape the types to prepare them
 * for markdown rendering.
 *
 * @param {!Object} doc Document representing a function jsdoc.
 */
var fixParamsAndReturns = function(doc) {
  // Remove duplicates.
  if (doc.params) {
    doc.params = _.uniq(doc.params, 'name');
    _.each(doc.params, function(param) {
      // Remove null descriptions.
      if (param.description === 'null') {
        param.description = '';
      }
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
 * Generate a unique file name with an index used to concatenate.
 */
var fileName = function(doc, i) {
  var index = '00' + (i++);
  index = index.substring(index.length - 3);
  return doc.fileName + index + '.md';
};

/**
 * Used to generate a sequence number for each function.
 * @type {number}
 */
var i = 1;

module.exports = {
  name: 'tag-fixer',
  description: 'Get the name of the function, format the @param and @return ' +
      'annotations to prepare them for rendering and generate an output file ' +
      'name using a sequence.',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    docs.forEach(function(doc) {
      findName(doc);
      fixParamsAndReturns(doc);

      doc.outputPath = fileName(doc, i++);
    });

    return docs;
  }
};
