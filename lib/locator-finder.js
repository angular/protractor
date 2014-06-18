var _ = require('lodash');

(function() {

  /**
   * Create a selector by css given the element's tag name and an attribute.
   *
   * @param {string} tagName The tag name.
   * @param {string} attrName The element's attribute name (for example:
   *     class="", value="").
   * @param {string} attrValue The element's attribute value.
   * @return {(null|string|Array.<string>)} Null when a css selector cannot be
   *     created.
   */
  var byCss = function(tagName, attrName, attrValue) {
    if (attrName === 'id') {
      return 'by.css(\'#' + attrValue + '\')';
    }

    if (attrName === 'class') {
      // For the 'class' attribute avoid div[class="foo bar"] and return
      // 'div.foo.bar'. Ignore ng classes.
      var classes = _.reject(attrValue.split(' '), function(className) {
        return /^ng-.*/.test(className);
      }).join('.');

      if (!classes) {
        return null;
      }

      // Return both 'div.className' and '.className'.
      return [
        'by.css(\'' + tagName + '.' + classes + '\')',
        'by.css(\'.' + classes + '\')'
      ];
    }

    // Escape colon-formatted (ng:model) attributes.
    attrName = attrName.replace(/ng\:/, 'ng\\\\:');

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
      var locators = [],
          addBinding = function(binding) {
            locators.push('by.binding(\'' + binding + '\')');
          };

      // Binding can take many forms. Try the following:
      // '({{nickname|uppercase}})', 'nickname|uppercase', and 'nickname'.
      addBinding(value);
      var insideCurlies = /{{(.+)}}/.exec(value);
      if (insideCurlies) {
        addBinding(insideCurlies[1]);

        // Is there a filter?
        var beforeFilter = /(.+)\|.+/.exec(insideCurlies[1]);
        if (beforeFilter) {
          addBinding(beforeFilter[1]);
        }
      }

      return locators;
    },
    byButtonText: function(buttonText) {
      var trimmed = (buttonText || '').trim();
      return 'by.buttonText(\'' + trimmed + '\')';
    },
    /**
     * Generate css locator suggestions.
     * @param {Object.<string, string>} attributeMap The element attributes and
     *     values.
     * @return {Array.<string>} A list of 'by.css' suggestions.
     */
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
          flatten().
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
   * Create a locator suggestions.
   *
   * @param {string} loc
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
   * Generate a list of locators based on the locators suggested by the chrome
   * extension. The extension locators have the following format:
   *
   * {
   *   byCss: {
   *     nodeName: string,
   *     ... And a key / value pair for each attribute.
   *   },
   *   byId: string,
   *   byButtonText: string,
   *   byLinkText: string,
   *   byBinding: string,
   *   byModel: string
   * }
   *
   * @param {!Object} extensionLocators The locators coming from the
   *     chrome extension.
   * @return {Array.<{name:string, locator: string, countExpression: string}>}
   */
  module.exports.buildLocatorList = function(extensionLocators) {
    return _.chain(extensionLocators).
        map(function(value, locatorType) {
          var suggestions = buildSuggestions(locatorType, extensionLocators);
          if (!suggestions) {
            return;
          }

          suggestions = _.isArray(suggestions) ? suggestions : [suggestions];
          return _.map(suggestions, function(suggestion) {
            // Count the number of matches.
            var countExpression = 'element.all(' + suggestion + ').count()';

            return {
              name: locatorType,
              locator: suggestion,
              countExpression: countExpression
            };
          });
        }).
        flatten().
        compact().
        value();
  };
})();
