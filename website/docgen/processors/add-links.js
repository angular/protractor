var _ = require('lodash');

/**
 * A lookup table with all the types in the parsed files.
 * @type {Object.<string, Array.<Object>>}
 */
var typeTable;

/**
 * A lookup table with links to external types.
 * @type {Object.<string, string}
 */
var externalTypes = {};

/**
 * The hash used to generate the links to the source code.
 */
var linksHash = require('../../../package.json').version;

/**
 * Add a link to the source code.
 * @param {!Object} doc Current document.
 */
var addLinkToSourceCode = function(doc) {
  // Heuristic for the custom docs in the lib/selenium-webdriver/ folder.
  if (doc.name && doc.name.startsWith('webdriver')) {
    return;
  }
  var template = _.template('https://github.com/angular/protractor/blob/' +
      '<%= linksHash %>/lib/<%= fileName %>.ts');

  doc.sourceLink = template({
    linksHash: linksHash,
    fileName: doc.fileName
  });
};

/**
 * Add links to @link annotations. For example: `{@link foo.bar}` will be
 * transformed into `[foo.bar](foo.bar)` and `{@link foo.bar FooBar Link}` will
 * be transfirned into `[FooBar Link](foo.bar)`
 * @param {string} str The string with the annotations.
 * @param {!Object} doc Current document.
 * @return {string} A link in markdown format.
 */
var addLinkToLinkAnnotation = function(str, doc) {
  var oldStr = null;
  while (str != oldStr) {
    oldStr = str;
    var matches = /{\s*@link[plain]*\s+([^]+?)\s*}/.exec(str);
    if (matches) {
      var str = str.replace(
          new RegExp('{\\s*@link[plain]*\\s+' +
              matches[1].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\s*}'),
              toMarkdownLinkFormat(matches[1], doc,
                matches[0].indexOf('linkplain') == -1)
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
 * Takes a link of the format 'type' or 'type description' and creates one of
 * the format '[description](type)'.
 *
 * Also does some minor reformatting of the type.
 *
 * @param {string} link The raw link.
 * @param {!Object} doc Current document.
 * @return {string} A link for the type.
 */
var toMarkdownLinkFormat = function(link, doc, code) {
  var type, desc;

  // Split type and description
  var i = link.indexOf(' ');
  if (i == -1) {
    desc = type = link;
  } else {
    desc = link.substr(i).trim();
    type = link.substr(0, i).trim();
  }
  if (code) {
    desc = '{@code ' + desc + '}'
  }
  desc = desc.replace(new RegExp('\n', 'g'), ' ');

  if (desc in externalTypes) {
    type = externalTypes[desc];
  }

  if (!type.match(/^https?:\/\//)) {
    // Remove extra '()' at the end of types
    if (type.substr(-2) == '()') {
      type = type.substr(0, type.length - 2);
    }

    // Expand '#' at the start of types
    if (type[0] == '#') {
      type = doc.name.substr(0, doc.name.lastIndexOf('.') + 1) + type.substr(1);
    }

    // Replace '#' in the middle of types with '.'
    type = type.replace(new RegExp('#', 'g'), '.prototype.');

    // Only create a link if it's in the API
    if (!typeTable[type]) {
      return desc;
    }
  }
  return '[' + desc + '](' + type + ')';
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
    if (type.name) {
      str = str.replace(type.name, toMarkdownLinkFormat(type.name));
    }
  };

  if (type.type === 'FunctionType') {
    _.each(type.params, replaceWithLinkIfPresent);
  } else if (type.type === 'TypeApplication') {
    // Is this an Array.<type>?
    var match = str.match(/Array\.<(.*)>/);
    if (match) {
      var typeInsideArray = match[1];
      str = str.replace(typeInsideArray, toMarkdownLinkFormat(typeInsideArray));
    }
  } else if (type.type === 'NameExpression') {
    replaceWithLinkIfPresent(type);
  }

  return escape(str);
};

/**
 * Filters out types with @external annotations and adds their @see link to the
 * externalTypes table
 *
 * @param {Array.<Object>} docs The jsdoc list.
 */
var filterExternalDocs = function(docs) {
  return _.reject(docs, function (doc) {
    if (!!doc.external) {
      externalTypes[doc.name] = doc.see[0];
      return true;
    }
    return false;
  });
};

/**
 * Add links to the external documents
 */
module.exports = function addLinks() {
  return {
    $runAfter: ['extracting-tags'],
    $runBefore: ['tags-extracted'],
    $process: function(docs) {
      typeTable = _.groupBy(docs, 'name');

      docs = filterExternalDocs(docs);

      docs.forEach(function(doc) {
        addLinkToSourceCode(doc);
        doc.description = addLinkToLinkAnnotation(doc.description, doc);

        // Add links for the params.
        _.each(doc.params, function(param) {
          param.paramString = getTypeString(param);
          param.description = addLinkToLinkAnnotation(param.description, doc);
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

      return docs;
    }
  };
};
