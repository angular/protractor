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

  it('should add isChild flag to children', function() {
    createController(getSampleToc());
    var items = _.map(scope.items, function(item) {
      return _.pick(item, 'isChild', 'displayName');
    });
    expect(items).toEqual([
      {displayName: 'protractor'},
      {isChild: false, displayName: 'ElementArrayFinder'},
      {isChild: true, displayName: 'getWebElements'},
      {isChild: true, displayName: 'get'},
      {displayName: 'webdriver'},
      {isChild: false, displayName: 'webdriver.WebDriver'},
      {isChild: true, displayName: 'createSession'},
      {isChild: true, displayName: 'controlFlow'},
      {isChild: false, displayName: 'Options'},
      {isChild: true, displayName: 'addCookie'}
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

  it('should add children to the protractor title', function() {
    // When you get the sample table of contents.
    createController(testToc());

    // Then ensure the title has children.
    var firstItem = scope.items[0];
    expect(firstItem.isTitle).toBe(true);
    expect(firstItem.children).toBeDefined();
  });

  describe('Menu visibility', function() {
    beforeEach(function() {
      createController(testToc());
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
});
