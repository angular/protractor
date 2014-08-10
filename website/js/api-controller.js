(function() {
  /**
   * Controller for the protractor api view.
   *
   * @constructor
   * @param $http HTTP service.
   * @param $location Location service.
   * @param $sce Strict Contextual Escaping service.
   * @param $scope Angular scope.
   */
  var ApiCtrl = function($http, $location, $sce, $scope) {
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

    $scope.toggleMenuLabel = function() {
      return $scope.isMenuVisible ? 'Hide list' : 'Show list';
    };

    $scope.toggleMenu = function() {
      $scope.isMenuVisible = !$scope.isMenuVisible;
    };

    $scope.showElement = function(item) {
      // Update the query string with the view name.
      $location.search('view', item.name);
      $scope.currentItem = item;
    };

    /**
     * Use the $sce service to trust the html rendered in the view.
     * @param html
     */
    $scope.trust = function(html) {
      if (!html) {
        return;
      }

      // Does it come with a type? Types come escaped as [theType].
      var match = html.match(/.*(\[(.*)\]).*/);
      if (match) {
        var link = '<a href="#/api?view=' + match[2] + '">' + match[2] + '</a>';
        html = html.replace(match[1], link);
      }

      return $sce.trustAsHtml(html);
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

      self.addExtends(list);
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

      // Add short description.
      if (item.description) {
        item.shortDescription =
            item.description.substring(0., item.description.indexOf('.') + 1);
      }
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
        item.type = 'child';
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
          type: 'title',
          children: byFileName[item.fileName]
        });
      }

      itemsWithTitles.push(item);
    });

    return itemsWithTitles;
  };

  ApiCtrl.prototype.addExtends = function(list) {
    list.forEach(function(item) {
      if (!item.extends) {
        return;
      }

      // Remove braces from {type}.
      var name = item.extends.replace(/[{}]/g, '');
      var nameExpr = new RegExp(name + '\\.prototype');

      item.base = {
        name: name,
        items: _.filter(list, function(item) {
          return item.name && item.name.match(nameExpr);
        })
      };
    });
  };

  angular.module('protractorApp').controller('ApiCtrl', ApiCtrl);
})();
