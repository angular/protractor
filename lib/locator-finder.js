var _ = require('lodash');

(function() {

  /**
   * Create a selector by css given the tag name and one of the attributes.
   * @param {string} tagName The tag name
   * @param {string} attrName The tag's attribute name (for example: class=""
   *     value="").
   * @param {string} attrValue The tag's attribute value.
   * @return {?string} Null when a css selector cannot be created.
   */
  var byCss = function(tagName, attrName, attrValue) {
    // For the 'class' attribute avoid div[class="foo bar"] and return
    // 'div.foo.bar'.
    if (attrName === 'class') {
      // Ignore ng classes.
      var classes = _.reject(attrValue.split(' '), function(className) {
        return /^ng-.*/.test(className);
      }).join('.');

      if (!classes) {
        return null;
      }

      return 'by.css(\'' + tagName + '.' + classes + '\')'
    }

    return 'by.css(\'' + tagName +
        '[' + attrName + '="' + attrValue + '"]\')';
  };

  /**
   * Mapping between the locators coming from the chrome extension and the
   * functions that create locators for each type.
   *
   * @type {Object.<string, Function>}
   */
  var strategies = {
    byBinding: function(value) {
      return 'by.binding(\'' + value + '\')';
    },
    byButtonText: function(value) {
      return 'by.buttonText(\'' + value + '\')';
    },
    byCss: function(attributeMap) {
      var tagName = attributeMap.nodeName;

      // Try every attribute. Ignore null and undefined.
      return _.chain(attributeMap).
          map(function(attrValue, attrName) {
            // Don't create suggestion for tag name.
            if (attrName !== 'nodeName') {
              return byCss(tagName, attrName, attrValue);
            }
          }).
          compact().
          value();
    },
    byId: function(value) {
      return 'by.id(\'' + value + '\')';
    },
    byLinkText: function(value) {
      return  'by.linkText(\'' + value + '\')';
    },
    byModel: function(value) {
      return 'by.model(\'' + value + '\')';
    }
  };

  /**
   *
   * @param loc
   * @param locators
   * @return {string|Array.<string>}
   */
  var buildSuggestions = function(loc, locators) {
    if (!strategies[loc]) {
      return null;
    }
    return strategies[loc](locators[loc]);
  };

  /**
   *
   * @param {Object} locators
   * @return {Array.<{name:string, locator: string, countExpression: string}>}
   */
  module.exports.buildLocatorList = function(locators) {
    var locatorList = [];

    _.each(locators, function(value, locatorType) {
      var suggestions = buildSuggestions(locatorType, locators);
      if (!suggestions) {
        return;
      }

      suggestions = _.isArray(suggestions) ? suggestions : [suggestions];
      _.each(suggestions, function(suggestion) {
        // Count the number of matches.
        var countExpression = 'element.all(' + suggestion + ').count()';

        locatorList.push({
          name: locatorType,
          locator: suggestion,
          countExpression: countExpression
        });
      });
    });

    return locatorList;
  };
})();
