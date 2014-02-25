(function() {
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
   * Add links to the types.
   * @param {!Object} doc Current document.
   */
  var addTypeLinks = function(doc) {
    // Check the params,
    _.each(doc.params, function(param) {
      // Skip if there is not type.
      var paramType = param.type;
      if (!paramType || !paramType.description) {
        return
      }

      // Is this symbol defined in the list?
      if (!symbolTable[paramType.description]) {
        return;
      }

      // The link looks like: 'elementFinder.isPresent', transform it into
      // 'elementfinderispresent'.
      var name = symbolTable[paramType.description][0].name;
      var linkName = name.replace(/[\.\$]/g, '').toLocaleLowerCase();

      paramType.description = '[' + name + '](#' + linkName + ')';
    });
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
