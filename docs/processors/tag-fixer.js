var _ = require('lodash');

/**
 * Add the description property to the doc. The description is all the text that
 * goes before the first annotation.
 * @param {!Object} doc Current doc.
 */
var addDescription = function(doc) {
  var content = doc.content || '';

  // Does it have tags? Find the text until the first @.
  doc.description = /@/.test(content) ?
      content.substring(0, content.indexOf('@')).replace(/\n*$/g, '') :
      content;
};

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
 * Escape the < > | characters from the param or return type.
 * @param {!Object} type Parsed type.
 */
var escapeTypeNames = function(type) {
  if (type && type.name) {
    type.name = _.escape(type.name).replace(/\|/g, '&#124;');
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
      escapeTypeNames(param.type);
    });
  }

  // Replace new lines in the return and params descriptions.
  var returns = doc.returns;
  if (returns) {
    replaceNewLines(returns, 'description');
    escapeTypeNames(returns.type);
  }
};

module.exports = {
  name: 'tag-fixer',
  description: 'Get the name of the function, format the @param and @return ' +
      'annotations to prepare them for rendering.',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    docs.forEach(function(doc) {
      addDescription(doc);
      findName(doc);
      fixParamsAndReturns(doc);

      // Set the template name to use api-template.md.
      doc.template = 'api';
    });

    return docs;
  }
};
