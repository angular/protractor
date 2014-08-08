(function() {
  /**
   * Controller for the protractor api view.
   *
   * @constructor
   * @param $http
   * @param $location
   * @param $scope
   */
  var ApiCtrl = function($http, $location, $scope) {
    this.$http = $http;
    this.$location = $location;
    this.$scope = $scope;

    this.loadTableOfContents();

    $scope.items = [];
    $scope.isMenuVisible = false;
    $scope.currentItem = {
      title: 'Protractor API Docs',
      description: 'Welcome to the Protractor API docs page. These pages ' +
          'contain the Protractor reference materials.'
    };

    $scope.showElement = function(item) {
      // Update the query string with the view name.
      $location.search('view', item.name);
      $scope.currentItem = item;
    };
  };

  /** Load the json data containing the toc. */
  ApiCtrl.prototype.loadTableOfContents = function() {
    var self = this;
    var $scope = self.$scope;

    this.$http.get('apiDocs/toc.json').success(function(data) {
      var list = data.items;

      // Remove 'WebdriverBy.prototype' from the list.
      list = Array.prototype.filter.call(list, function(item) {
        return item.name !== 'WebdriverBy.prototype';
      });

      self.setDisplayNameAndMarkChildren(list);
      var items = self.addTitles(list);

      $scope.items = items;
      $scope.version = data.version;

      // Show the view if is defined in the query string.
      var view = self.$location.search().view;
      if (view) {
        items.forEach(function(item) {
          if (view === item.name) {
            self.$scope.showElement(item);
          }
        })
      }
    });
  };

  /**
   * Set the 'displayName' and the 'isChild' flags.
   * @param list
   */
  ApiCtrl.prototype.setDisplayNameAndMarkChildren = function(list) {
    var itemsByName = {};
    
    var getTitle = function(item) {
      if (item.alias) {
        return item.alias;
      }

      var fnName = item.name;
      // Is the parent already visited?
      var parts = fnName.match('(.*)\\.prototype\\.(.*)');
      if (parts && itemsByName[parts[1]]) {
        var parent = itemsByName[parts[1]];
        return parent.title + '.' + parts[2];
      }

      return fnName;
    };

    // Add display name and title.
    list.forEach(function(item) {
      item.title = getTitle(item);

      var nameWithoutPrototype = item.name.replace(/\.prototype/, '');

      itemsByName[item.name] = item;
      itemsByName[nameWithoutPrototype] = item;

      item.displayName = nameWithoutPrototype;
    });

    /**
     * Try to find a parent by matching the longest substring of the display
     * name.
     * @param item
     */
    var findClosestParent = function(item) {
      var parts = item.displayName.split('.');
      for (var i = parts.length - 1; i > 0; i--) {
        var name = parts.slice(0, i).join('.');
        if (itemsByName[name]) {
          return itemsByName[name];
        }
      }
    };

    list.forEach(function(item) {
      var parent = findClosestParent(item);
      if (parent) {
        parent.isChild = false;

        item.isChild = true;
        item.displayName =
            item.displayName.replace(new RegExp('^' + parent.name + '\\.'), '');


        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      }
    });
  };

  /**
   * Add the title rows to the list.
   * @param list
   * @return {Array}
   */
  ApiCtrl.prototype.addTitles = function(list) {
    var itemsWithTitles = [],
        prevFileName = null,
        byFileName = {};

    list.forEach(function(item) {
      // Group items by file name.
      if (!byFileName[item.fileName]) {
        byFileName[item.fileName] = [];
      }
      byFileName[item.fileName].push(item);

      if (prevFileName !== item.fileName) {
        prevFileName = item.fileName;
        itemsWithTitles.push({
          displayName: item.fileName,
          isTitle: true,
          children: byFileName[item.fileName]
        });
      }

      itemsWithTitles.push(item);
    });

    return itemsWithTitles;
  };

  angular.module('protractorApp').controller('ApiCtrl', ApiCtrl);
})();
