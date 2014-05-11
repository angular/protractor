var panels = chrome.devtools.panels,
    protractorSidebar = null;

/**
 * Generate a set of suggestions based on the currently selected element in the
 * developer tools.
 * @return {!Object}
 */
var getSuggestions = function() {
  try {
    var crumb = function(node) {
      var idOrClass = (node.id && '#' + node.id) ||
          ('' + node.classList && (' ' + node.classList).replace(/ /g, '.'));
      return node.tagName.toLowerCase() + idOrClass;
    };

    // TODO(andresdom): remove ng-classes.
    var crumbPath = function(node) {
      return node.parentNode ?
          crumbPath(node.parentNode).concat(crumb(node)) : [];
    };

    // Angular and a selected element are required.
    if (!(window.angular && $0)) {
      return {};
    }

    var el = angular.element($0),
        locators = {};

    // Get all the element attributes to generate byCss locators.
    locators.byCss = {
      nodeName: $0.nodeName.toLowerCase()
    };
    angular.forEach($0.attributes, function(attribute) {
      locators.byCss[attribute.name] = attribute.value;
    });

    // Id?
    if (el.attr('id')) {
      locators.byId = el.attr('id');
    }

    // Button?
    if ($0.tagName === 'BUTTON' || el.attr('type') === 'button') {
      locators.byButtonText = el.text() || el.attr('value');
    }

    // Link?
    if ($0.tagName === 'A') {
      locators.byLinkText = el.text();
    }

    // Binding?
    if (el.hasClass('ng-binding')) {
      var dataBinding = el.data('$binding');
      var bindingName = dataBinding.exp || dataBinding[0].exp || dataBinding;
      locators.byBinding = bindingName;
    }

    // Model? Test all of the prefixes.
    var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng:'];
    prefixes.forEach(function(prefix) {
      // Bail out if model was found.
      if (!locators.byModel &&  $0.getAttribute(prefix + 'model')) {
        locators.byModel = $0.getAttribute(prefix + 'model');
      }
    });

    locators.cssPath = crumbPath($0);

    return locators;
  } catch (e) {
    return {};
  }
};

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "panel"
});

// Send a message to the background page to open a connection.
backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

// Update the side pane when we get a response from the element explorer.
backgroundPageConnection.onMessage.addListener(function(msg) {
  protractorSidebar.setObject(msg.results, 'Locators');
});

// Create a side pane that will show the locator suggestion results.
panels.elements.createSidebarPane('Protractor', function(sidebar) {
  protractorSidebar = sidebar;

  panels.elements.onSelectionChanged.addListener(function() {
    sidebar.setObject({});

    var cmd = '(' + getSuggestions.toString() + ')()';

    chrome.devtools.inspectedWindow.eval(cmd,
        function(selectors, isException) {
          if (isException) {
            return;
          }

          backgroundPageConnection.postMessage({
            name: 'selectionChanged',
            selectors: selectors
          });
        }
    );
  });
});
