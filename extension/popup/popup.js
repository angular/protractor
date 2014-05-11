var ptorApp = angular.module('ptorApp', ['ngResource']);

ptorApp.factory('locatorTester', function($resource) {
  var testSelector = $resource('http://localhost:13000/testSelector');

  return {
    get: function(input, cb) {
      var requestParams = {
        locators: {popupInput: input}
      };
      testSelector.get(requestParams).$promise.then(cb);
    }
  };
});

// A service to persist the locator history when you close the popup.
ptorApp.factory('history', function() {
  var bgPage = chrome.extension.getBackgroundPage();

  return {
    save: function(history) {
      bgPage.saveHistory(angular.copy(history));
    },
    restore: function($scope) {
      $scope.history = bgPage.getLocatorHistory();
    }
  };
});

ptorApp.controller('LocatorCtrl', function($scope, history, locatorTester) {
  var app = $scope,
      maxElements = 10;

  // Restore the history, if there is any.
  history.restore($scope);

  // Copy a history into the input field.
  app.copyToInput = function(row) {
    app.locator = row.locator;
  };

  // Clear the history list.
  app.clearHistory = function() {
    app.history = [];
    history.save(app.history);
  };

  // Test the locator.
  app.testLocator = function() {
    locatorTester.get(app.locator, function(data) {
      // Add results to history.
      angular.forEach(data.results, function(count, locator) {
        app.history.unshift({
          locator: locator,
          count: count
        });
      });

      // Check for max length.
      if (app.history.length > maxElements) {
        app.history.length = maxElements;
      }
      history.save(app.history);
    });
  };
});
