'use strict';

describe('ApiCtrl', function() {
  var $controller_, $httpBackend, $location, $rootScope_, ctrl, scope;

  beforeEach(module('protractorApp'));

  beforeEach(inject(
      function($controller, $rootScope, _$httpBackend_, _$location_) {
        $controller_ = $controller;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $rootScope_ = $rootScope;
      }));

  var createController = function(tocData) {
    $httpBackend.expectGET('apiDocs/toc.json').respond(tocData);
    $httpBackend.whenGET('partials/home.html').respond({});

    scope = $rootScope_.$new();
    ctrl = $controller_('ApiCtrl', {$scope: scope});
    $httpBackend.flush();
  };

  var getSampleToc = function() {
    return {
      version: '1.0.0',
      items: [
        {
          alias: 'element.all(locator)',
          name: 'ElementArrayFinder',
          fileName: 'protractor'
        },
        {
          name: 'ElementArrayFinder.prototype.getWebElements',
          fileName: 'protractor'
        },
        {
          name: 'ElementArrayFinder.prototype.get',
          fileName: 'protractor'
        },
        {
          name: 'webdriver.WebDriver',
          fileName: 'webdriver'
        },
        {
          name: 'webdriver.WebDriver.createSession',
          fileName: 'webdriver'
        },
        {
          name: 'webdriver.WebDriver.prototype.controlFlow',
          fileName: 'webdriver'
        },
        {
          name: 'webdriver.WebDriver.Options',
          fileName: 'webdriver'
        },
        {
          name: 'webdriver.WebDriver.Options.prototype.addCookie',
          fileName: 'webdriver'
        }
      ]
    };
  };

  var findItemByName = function(displayName) {
    return _.findWhere(scope.items, {displayName: displayName});
  };

  it('should fetch toc and populate items', function() {
    createController(getSampleToc());
    expect(scope.items.length).toBeGreaterThan(0);
  });

  it('should add title item at the top', function() {
    createController(getSampleToc());
    var firstItem = scope.items[0];

    expect(firstItem.displayName).toBe('protractor');
    expect(firstItem.isTitle).toBe(true);
  });

  it('should give title to items', function() {
    createController({items: [
      {name: 'foo1', alias: 'bar'},
      {name: 'foo2'}
    ]});

    // Expect alias to be the title.
    expect(scope.items[1].title).toBe('bar');
    // Expect the name to be the title.
    expect(scope.items[2].title).toBe('foo2');
  });
  
  it('should use parent alias to generate title', function() {
    // Given a parent item with alias.
    createController({items: [
      {name: 'name1', alias: 'parent'},
      {name: 'name1.prototype.fn'}
    ]});

    // Expect the title to be parent + name.
    expect(scope.items[2].title).toBe('parent.fn');
  });

  it('should assign type to each item', function() {
    createController(getSampleToc());

    var items = scope.items;
    expect(items[0].type).toBe('title');
    expect(items[1].type).toBeUndefined();
    expect(items[2].type).toBe('child');
  });

  it('should add child type to children', function() {
    createController(getSampleToc());
    var items = _.map(scope.items, function(item) {
      return _.pick(item, 'type', 'displayName');
    });
    expect(items).toEqual([
      {type: 'title', displayName: 'protractor'},
      {displayName: 'ElementArrayFinder'},
      {type: 'child', displayName: 'getWebElements'},
      {type: 'child', displayName: 'get'},
      {type: 'title', displayName: 'webdriver'},
      {displayName: 'webdriver.WebDriver'},
      {type: 'child', displayName: 'createSession'},
      {type: 'child', displayName: 'controlFlow'},
      {type: 'child', displayName: 'Options'},
      {type: 'child', displayName: 'addCookie'}
    ]);
  });

  it('should assign display name', function() {
    createController(getSampleToc());
    expect(_.pluck(scope.items, 'displayName')).toEqual([
      'protractor',
      'ElementArrayFinder',
      'getWebElements',
      'get',
      'webdriver',
      'webdriver.WebDriver',
      'createSession',
      'controlFlow',
      'Options',
      'addCookie'
    ]);
  });

  it('should add children to the parent', function() {
    createController(getSampleToc());

    // Ensure 'ElementArrayFinder' has children.
    var parent = findItemByName('ElementArrayFinder');
    expect(_.pluck(parent.children, 'displayName')).toEqual([
      'getWebElements',
      'get'
    ]);
  });

  describe('Menu visibility', function() {
    beforeEach(function() {
      createController(getSampleToc());
    });

    it('should start with the nav bar hidden', function() {
      expect(scope.isMenuVisible).toBe(false);
    });

    it('should toggle visibility', function() {
      // Given that the menu is not visible.
      expect(scope.isMenuVisible).toBe(false);

      // When you toggle the menu.
      scope.toggleMenu();

      // Then ensure the menu is visible.
      expect(scope.isMenuVisible).toBe(true);
    });

    it('should get toggle menu label', function() {
      expect(scope.toggleMenuLabel()).toBe('Show list');

      // When you toggle the menu.
      scope.toggleMenu();

      // Then ensure the label has changed.
      expect(scope.toggleMenuLabel()).toBe('Hide list');
    });
  });

  describe('Extends', function() {
    it('should add parent reference', function() {
      // When you have an items that extends.
      createController({items: [
        {name: 'name1', alias: 'parent'},
        {name: 'name1.prototype.fn'},
        {name: 'name2', extends: '{name1}'}
      ]});
      
      // Then ensure the extending item has the functions of the parent.
      var item = scope.items[3];
      expect(item.title).toBe('name2');
      expect(item.base.name).toBe('name1');
      expect(item.base.items.length).toBe(1);
    });
  });
});
