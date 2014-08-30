describe('Directives', function() {

  var compile, element, scope;

  beforeEach(module('protractorApp'));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  var createDirective = function(html) {
    element = angular.element(html);
    compile(element)(scope);
    scope.$digest();
  };

  it('should update markup when scope changes', function() {
    // Given that you have a scope variable.
    scope.currentItem = {
      example: '123'
    };

    // When you create the directive.
    createDirective('<pre ptor-code="currentItem.example"></pre>');

    // Then ensure the code got pretified.
    expect(element.html()).toBe('<span class="lit">123</span>');

    // When you change the scope variable.
    scope.$apply(function() {
      scope.currentItem.example = '456';
    });

    // Then ensure the html changed.
    expect(element.html()).toBe('<span class="lit">456</span>');
  });
});
