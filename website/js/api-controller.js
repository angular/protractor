(function() {
  /**
   * Controller for the protractor api view.
   *
   * @constructor
   * @ngInject
   * @param $anchorScroll anchorScroll service.
   * @param $http HTTP service.
   * @param $location Location service.
   * @param $route Route service.
   * @param $sce Strict Contextual Escaping service.
   * @param $scope Angular scope.
   */
  var ApiCtrl = function($anchorScroll, $http, $location, $route, $sce, $scope) {
    this.$http = $http;
    this.$route = $route;
    this.$scope = $scope;

    this.loadTableOfContents();

    $scope.items = [];
    $scope.isMenuVisible = false;
    var defaultItem = {
      title: 'Protractor API Docs',
      description: 'Welcome to the Protractor API docs page. These pages ' +
      'contain the Protractor reference materials.'
    };
    $scope.currentItem = defaultItem;

    // Watch for location changes to show the correct item.
    $scope.$on('$locationChangeSuccess', function() {
      // Not going to api? ignore event.
      if (!$location.url().match(/^\/api/)) {
        return;
      }

      var view = $route.current.params.view,
          item = _.findWhere($scope.items, {name: view});

      if (view && item) {
        $scope.showElement(item);
      } else {
        // No view? Show default item.
        $scope.currentItem = defaultItem;
      }
    });

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

      // Scroll to the top.
      $anchorScroll();
    };

    /**
     * Use the $sce service to trust the html rendered in the view.
     * @param html
     */
    $scope.trust = function(html) {
      if (!html) {
        return;
      }

      // Does it come with a type? Types come escaped as [description](theType).
      var match;
      while (match = html.match(/(\[(.*?)\]\((.*?)\))/)) {
        var link = '<a href="' +
            (match[3].match(/^https?:\/\//) ? '' : '#/api?view=') + match[3] +
            '">' + match[2] + '</a>';
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

      self.setViewProperties(list);
      var items = self.addTitleItems(list);

      $scope.items = items;
      $scope.version = data.version;

      // Show the view if is defined in the query string.
      var view = self.$route.current.params.view;
      if (view) {
        items.forEach(function(item) {
          if (view === item.name) {
            self.$scope.showElement(item);
          }
        });
      }

      self.addExtends(list);
    });
  };

  /**
   * Set the extra properties used by the view to show the docs.
   * @param list
   */
  ApiCtrl.prototype.setViewProperties = function(list) {
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
  ApiCtrl.prototype.addTitleItems = function(list) {
    var itemsPlusTitles = [],
        prevFileName = null;

    list.forEach(function(item) {
      if (prevFileName !== item.fileName) {
        prevFileName = item.fileName;
        itemsPlusTitles.push({
          displayName: item.fileName,
          isTitle: true,
          type: 'title'
        });
      }

      itemsPlusTitles.push(item);
    });

    return itemsPlusTitles;
  };

  ApiCtrl.prototype.addExtends = function(list) {
    list.forEach(function(item) {
      if (!item.extends) {
        return;
      }

      // Remove braces from {type}.
      var parentName = item.extends.replace(/[{}]/g, '');
      var nameExpr = new RegExp(parentName + '\\.prototype');

      // Find all the parent functions.
      item.base = {
        name: parentName,
        items: _.filter(list, function(item) {
          return item.name && item.name.match(nameExpr);
        })
      };
    });
  };

  angular.module('protractorApp').controller('ApiCtrl', ApiCtrl);
})();
