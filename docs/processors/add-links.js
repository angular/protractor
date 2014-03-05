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
 * Add links to @link annotations. For example: {@link foo.bar} will be
 * transformed into '[foo.bar](#foobar)'.
 * @param {string} str The string with the annotations.
 * @return {string} A link in markdown format.
 */
var addLinkToLinkAnnotation = function(str) {
  if (str) {
    var matches = /{@link\s+([\w\.]+)}/.exec(str);
    if (matches && typeTable[matches[1]]) {
      return str.replace(
          new RegExp('{@link\\s+' + matches[1] + '\\s*}'),
          toMarkdownLinkFormat(matches[1])
      );
    }
  }
  return str;
};

/**
 * Escape the < > | characters.
 * @param {string} str The string to escape.
 */
var escape = function(str) {
  return _.escape(str).replace(/\|/g, '&#124;').replace(/!\[/, '&#33;[');
};

/**
 * Create a markdown link with the following format: '[foo.Bar](#foobar)'
 * @param {string} type The type you want to link.
 * return {string} A markdown link for the type.
 */
var toMarkdownLinkFormat = function(type) {
  var lowercaseType = type.replace(/[\.\$]/g, '').toLocaleLowerCase();
  return '[' + type + '](#' + lowercaseType + ')';
};

/**
 * Create the param or return type.
 * @param {!Object} param Parameter.
 * @return {string} Escaped param string with links to the types.
 */
var getTypeString = function(param) {
  var str = param.typeExpression;
  var type = param.type;
  if (!type) {
    return escape(str);
  }

  var replaceWithLinkIfPresent = function(type) {
    if (typeTable[type.name]) {
      str = str.replace(type.name, toMarkdownLinkFormat(type.name));
    }
  };

  if (type.type === 'FunctionType') {
    _.each(type.params, replaceWithLinkIfPresent);
  } else if (type.type === 'NameExpression') {
    replaceWithLinkIfPresent(type);
  }

  return escape(str);
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
    typeTable = _.groupBy(docs, 'name');

    docs.forEach(function(doc) {
      addLinkToSourceCode(doc);
      doc.description = addLinkToLinkAnnotation(doc.description);

      // Add links for the param types.
      _.each(doc.params, function(param) {
        param.paramString = getTypeString(param);
      });

      // Add links for the return types.
      var returns = doc.returns;
      if (returns) {
        doc.returnString = getTypeString(returns);
        returns.description = addLinkToLinkAnnotation(returns.description);
      } else {
        doc.returnString = '';
      }
    });
  }
};
