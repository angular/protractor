var panels = chrome.devtools.panels,
    protractorSidebar = null,
    isSidebarPaneShown = false;

/**
 * Generate a set of suggestions based on the currently selected element in the
 * developer tools.
 * @return {!Object}
 */
var getSuggestions = function() {
  try {
    // Angular and a selected element are required.
    if (!(window.angular && $0)) {
      return {};
    }

    var el = angular.element($0),
        locators = {};

    // Get all the element attributes to generate byCss locators.
    if ($0.attributes.length) {
      locators.byCss = {
        nodeName: $0.nodeName.toLowerCase()
      };
      angular.forEach($0.attributes, function(attribute) {
        locators.byCss[attribute.name] = attribute.value;
      });
    }

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

  // Check for visibility to ignore selection changes.
  sidebar.onShown.addListener(function() {
    isSidebarPaneShown = true;
  });
  sidebar.onHidden.addListener(function() {
    isSidebarPaneShown = false;
  });

  // Listen for changes in the selected element.
  panels.elements.onSelectionChanged.addListener(function() {
    // Ignore selection changes when not shown shown.
    if (isSidebarPaneShown === false) {
      sidebar.setObject({});
      return;
    }

    var cmd = '(' + getSuggestions.toString() + ')()';

    chrome.devtools.inspectedWindow.eval(cmd,
        function(selectors, isException) {
          if (isException) {
            return;
          }

          // Are there any selectors?
          if (Object.keys(selectors).length) {
            backgroundPageConnection.postMessage({
              name: 'selectionChanged',
              selectors: selectors
            });
          } else {
            sidebar.setObject({log: 'Cannot find suggestions'}, 'Locators');
          }
        }
    );
  });
});
