(function() {
  /**
   * Add links to the types.
   * @param {!Object} doc Current document.
   */
  var addTypeLinks;
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

  var addTypeLink = function(paramOrReturn) {
    if (!paramOrReturn) {
      return;
    }

    // Skip if there is not type.
    var annotationType = paramOrReturn.type;
    if (!annotationType || !annotationType.description) {
      return
    }

    // Find the type name. The type may have the following formats:
    // some.type
    // Array.<some.type>
    // function(some.type)
    var type = annotationType.description;

    // &lt;webdriver.Locator&gt;
    var match = /(.*&lt;)?([\w\.]+)(&gt;.*)?/.exec(annotationType.description);
    if (match && match[2]) {
      type = match[2];
    }

    // Is this type defined in the list?
    if (!symbolTable[type]) {
      return;
    }

    // The link looks like: 'elementFinder.isPresent', transform it into
    // 'elementfinderispresent'.
    var typeName = symbolTable[type][0].name;
    var linkName = typeName.replace(/[\.\$]/g, '').toLocaleLowerCase();

    // Is there are bang! at the beginning?
    if (annotationType.description.match(new RegExp('^!' + type))) {
      type = "!" + type;
    }

    var typeLink = '[' + type + '](#' + linkName + ')';

    annotationType.description = annotationType.description.replace(type, typeLink);
  };

  addTypeLinks = function(doc) {
    _.each(doc.params, addTypeLink);
    addTypeLink(doc.returns);
  };

  var symbolTable;

  module.exports = {
    name: 'add-links',
    description: 'Add links to the external documents',
    runAfter: ['extracting-tags'],
    runBefore: ['tags-extracted'],
    init: function(config) {
    },
    process: function(docs) {
      symbolTable = _.groupBy(docs, 'name');

      docs.forEach(function(doc) {
        addLinkToSourceCode(doc);
        addTypeLinks(doc);
      });
    }
  };
})();
