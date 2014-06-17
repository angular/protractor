var _ = require('lodash');

/**
 * Add the description property to the doc. The description is all the text that
 * goes before the first annotation.
 * @param {!Object} doc Current doc.
 */
var addDescription = function(doc) {
  doc.description = (doc.tags.description || '').replace(/\n$/, '');
};

/**
 * Find the name of the function.
 */
var findName = function(doc) {
  // Skip if the function has a name.
  if (doc.name) {
    return doc.name;
  }

  try {
    var node = doc.code.node;

    // Is this a simple declaration? "var element = function() {".
    if (node.declarations && node.declarations.length) {
      return node.declarations[0].id.name;
    }

    // Is this an expression? "elementFinder.find = function() {".
    if (node.expression) {
      var parts = [];

      /**
       * Recursively create the function name by examining the object property.
       * @param obj Parsed object.
       * @return {string} The name of the function.
       */
      function buildName(obj) {
        if (!obj) {
          return parts.join('.');
        }

        if (obj.property && obj.property.name) {
          parts.unshift(obj.property.name);
        }

        if (obj.object && obj.object.name) {
          parts.unshift(obj.object.name);
        }

        return buildName(obj.object);
      }

      return buildName(node.expression.left);
    }
  } catch (e) {
    console.log('Could not find document name', doc.file, doc.endingLine);
  }
};

/**
 * Replace the new lines in an object property.
 * @param {!Object} obj Object with properties.
 * @param {string} prop Property name.
 */
var replaceNewLines = function(obj, prop) {
  if (obj) {
    obj[prop] = (obj[prop] || '').replace(/\n\s+/g, ' ');
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
  if (doc.params) {
    _.each(doc.params, function(param) {
      replaceNewLines(param, 'description');
    });
  }

  // Replace new lines in the return and params descriptions.
  var returns = doc.returns;
  if (returns) {
    replaceNewLines(returns, 'description');
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
      doc.name = findName(doc);
      fixParamsAndReturns(doc);

      // Set the template name to use api-template.md.
      doc.template = 'api';
    });

    return docs;
  }
};
