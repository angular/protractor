var _ = require('lodash');

var templateMapping = {
  protractor: _.template('https://github.com/angular/protractor/blob/' +
      '<%= linksHash %>/lib/<%= fileName %>.js#L<%= startingLine %>'),
  webdriver: _.template('https://code.google.com/p/selenium/source/browse/' +
      'javascript/webdriver/<%= fileName %>.js#<%= startingLine %>')
};

/**
 * A lookup table with all the types in the parsed files.
 * @type {Object.<string, Array.<Object>>}
 */
var typeTable;

/**
 * The hash used to generate the links to the source code.
 */
var linksHash = 'master';

/**
 * Add a link to the source code.
 * @param {!Object} doc Current document.
 */
var addLinkToSourceCode = function(doc) {
  var template = doc.fileInfo.filePath.indexOf('selenium-webdriver') !== -1 ?
      templateMapping.webdriver : templateMapping.protractor;

  doc.sourceLink = template({
    linksHash: linksHash,
    fileName: doc.fileName,
    startingLine: doc.startingLine
  });
};

/**
 * Add links to @link annotations. For example: {@link foo.bar} will be
 * transformed into '[foo.bar]'.
 * @param {string} str The string with the annotations.
 * @param {!Object} doc Current document.
 * @return {string} A link in markdown format.
 */
var addLinkToLinkAnnotation = function(str, doc) {
  var oldStr = null;
  while(str != oldStr) {
    oldStr = str;
    var matches = /{\s*@link\s+([^{}]+?)\s*}/.exec(str);
    if (matches) {
      var str = str.replace(
          new RegExp('{\\s*@link\\s+' + matches[1] + '\\s*}'),
          toMarkdownLinkFormat(matches[1], doc)
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
 * Takes a link of the format 'type' or 'type description' and creats one of the
 * format '[type](description)'.
 *
 * Also does some minor reformatting of the type.
 *
 * @param {string} link The raw link.
 * @param {!Object} doc Current document.
 * @return {string} A link for the type.
 */
var toMarkdownLinkFormat = function(link, doc) {
  var type, desc;

  // Split type and description
  var i = link.indexOf(' ');
  if(i == -1) {
    desc = type = link;
  } else {
    desc = link.substr(i).trim();
    type = link.substr(0, i).trim();
  }

  // Remove extra '()' at the end of types
  if(type.substr(-2) == '()') {
    type = type.substr(0, type.length - 2);
  }

  // Expand '#' at the start of types
  if(type[0] == '#') {
    var i = doc.name.lastIndexOf('.');
    if(i == -1) {
        i = 0;
    }
    type = doc.name.substr(0, i) + type.substr(1);
  }

  // Replace '#' in the middle of types with '.'
  type = type.replace(new RegExp('#', 'g'), '.');

  // Only create a link if it's in the API
  if(typeTable[type]) {
    return '['+type+']('+desc+')';
  } else {
    return desc;
  }
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
  } else if(type.type === 'TypeApplication') {
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
 * Add links to the external documents
 */
module.exports = function addLinks() {
  return {
    $runAfter: ['extracting-tags'],
    $runBefore: ['tags-extracted'],
    $process: function(docs) {
      typeTable = _.groupBy(docs, 'name');

      docs.forEach(function(doc) {
        addLinkToSourceCode(doc);
        doc.description = addLinkToLinkAnnotation(doc.description, doc);
        //Remove @link annotations we don't process
        if(doc.params) {
          for(var i = 0; i < doc.params.length; i++) {
            doc.params[i].description =  doc.params[i].description.replace(
                /{\s*@link\s+([^{}]+?)\s*}/, '$1');
          }
        }

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
  }
};
