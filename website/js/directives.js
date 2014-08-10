/**
 * Pretty print directives. They use google-code-prettify.
 * The 'prettyPrintOne' function is defined by Google pretty print at:
 * https://google-code-prettify.googlecode.com/svn/loader/prettify.js
 */
(function() {
  var module = angular.module('protractorApp');

  /**
   * Used to print code bound to the scope.
   * <pre ptor-code="scopeVar"></pre>
   */
  module.directive('ptorCode', function() {
    return {
      scope: {
        code: '=ptorCode'
      },
      link: function(scope, element) {
        element.html(prettyPrintOne(scope.code));
      }
    };
  });

  /**
   * Used to pretty print inline code:
   * <pre ptor-inline-code>some code</pre>
   */
  module.directive('ptorInlineCode', function() {
    return {
      compile: function(tElement) {
        var html = tElement.html();
        return function(scope, element) {
          element.html(prettyPrintOne(html));
        }
      }
    }
  });

  /**
   * Show the child functions.
   */
  module.directive('ptorFunctionList', function() {
    return {
      scope: {
        list: '=ptorFunctionList'
      },
      link: function(scope) {
        // This is an isolate scope. Call the parent to showElement.
        scope.showElement = scope.$parent.showElement;
      },
      templateUrl: 'partials/ptor-function-list.html'
    }
  });
})();
