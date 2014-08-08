/**
 * Pretty print directive. It uses google-code-prettify.
 * The 'prettyPrintOne' function is defined by Google pretty print at:
 * https://google-code-prettify.googlecode.com/svn/loader/prettify.js
 */
angular.module('protractorApp').directive('ptorCode', function() {
  return {
    scope: {
      code: '=ptorCode'
    },
    link: function(scope, element) {
      element.html(prettyPrintOne(scope.code));
    }
  };
});
