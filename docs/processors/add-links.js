var _ = require('lodash');

var templateMapping = {
  protractor: _.template('https://github.com/angular/protractor/blob/' +
      'master/lib/<%= fileName %>.js#L<%= startingLine %>'),
  webdriver: _.template('https://code.google.com/p/selenium/source/browse/' +
      'javascript/webdriver/webdriver.js#<%= startingLine %>')
};

/**
 * Add a link to the source code.
 * @param {!Object} doc Current document.
 */
var addLinkToSourceCode = function(doc) {
  var template = doc.fileName === 'webdriver' ?
      templateMapping.webdriver : templateMapping.protractor;

  doc.sourceLink = template(doc);
};

/**
 *
 * @param description
 * @return {string[]}
 */
var parseType = function(description) {
  var regExp;
  if (/function/.test(description)) {
    regExp = /(function\s*\(\s*!?)([\w\.]+)(\))?/;
  } else {
    regExp = /(.*&lt;)?([\w\.]+)(&gt;.*)?/;
  }

  var match = regExp.exec(description);
  if (match && match[2]) {
    return match[2];
  }

  return description;
};

/**
 * The link looks like: 'elementFinder.isPresent', transform it into
 * 'elementfinderispresent'.
 */
var linkForType = function(type) {
  var typeName = typeTable[type][0].name;
  return typeName.replace(/[\.\$]/g, '').toLocaleLowerCase();
};

var createTypeLink = function(paramOrReturn) {
  // Skip if there is not type.
  if (!paramOrReturn || !paramOrReturn.type || !paramOrReturn.type.name) {
    return null;
  }

  var typeName = paramOrReturn.type.name;

  // Find the type name. The type may have the following formats:
  // some.type
  // Array.<some.type>
  // function(some.type)
  var type = parseType(typeName);

  // Is this type defined in the list?
  if (!typeTable[type]) {
    return null;
  }

  // Is there are bang! at the beginning?
  var typeLink = '[' + type + '](#' + linkForType(type) + ')';

  // ![foo] is a link to an image. Escape with &#33;[foo].
  return typeName.replace(type, typeLink).replace(/!\[/, '&#33;[');
};

/**
 * Add links to the types for param and return annotations.
 * @param {!Object} paramOrReturn A param or return object.
 */
var addTypeLink = function(paramOrReturn) {
  var typeLink = createTypeLink(paramOrReturn);
  if (typeLink) {
    paramOrReturn.type.name = typeLink;
  }
};

var createLinkToType = function(annotationType, typeExpression, doc) {
  // Parse the type.
  if (doc.name == 'elementArrayFinder.each') {
    console.log(1);
  }

  var type = parseType(annotationType);
  if (type && typeTable[type]) {
    var typeLink = '[' + type + '](#' + linkForType(type) + ')';

    return typeExpression.replace(type, typeLink).replace(/!\[/, '&#33;[');
  }
};

/**
 * Escape the < > | characters.
 */
var escape = function(str) {
  return _.escape(str).replace(/\|/g, '&#124;');
};

/**
 * A lookup table with all the types in the parsed files.
 * @type {Object.<string, Array.<Object>>}
 */
var typeTable;

module.exports = {
  name: 'add-links',
  description: 'Add links to the external documents',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    try {
      typeTable = _.groupBy(docs, 'name');

      docs.forEach(function(doc) {
        addLinkToSourceCode(doc);
        // Add links for the param types.
        _.each(doc.params, function(param) {
          if (param.type) {
            var linkToType = createLinkToType(param.type.name, param.typeExpression, doc);
            param.paramString = escape(linkToType ? linkToType : param.typeExpression);
          }
        });

        // Add links for the return types.
        var returns = doc.returns;
        if (returns && returns.type) {
          var linkToType = createLinkToType(returns.type.name, returns.typeExpression, doc);
          doc.returnString = escape(linkToType ? linkToType : returns.typeExpression);
        }
      });
    } catch (e) {
      console.log('Error', e);
    }

  }
};
