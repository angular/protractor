
var connections = {};
var popupState = {
  history: []
};

/**
 * Save the popup history. Used by popup.js.
 * @param {Array.<Object>} msg
 */
var saveHistory = function(msg) {
  popupState.history = msg;
};

/**
 * Restore the popup history after closing and opening. Used by popup.js.
 * @return {Array.<Object>}
 */
var getLocatorHistory = function() {
  return popupState.history;
};

chrome.runtime.onConnect.addListener(function(port) {

  var extensionListener = function(message, sender, sendResponse) {

    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    if (message.name == 'init') {
      connections[message.tabId] = port;
      return;
    }

    try {
      if (message.name == 'selectionChanged') {
        var selectors = message.selectors,
            encodedLocators = encodeURIComponent(JSON.stringify(selectors)),
            url = 'http://localhost:13000/testSelector?locators=' + encodedLocators,
            xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            var parse = JSON.parse(xhr.response);

            // Send the response back to the dev tools.
            port.postMessage(parse);
          }
        };
        xhr.send();
      }

    } catch (e) {
    }
  };

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);
  port.onDisconnect.addListener(function(port) {
    port.onMessage.removeListener(extensionListener);

    var tabs = Object.keys(connections);
    for (var i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]];
        break;
      }
    }
  });
});
