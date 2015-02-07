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
        scope.$watch('code', function() {
          element.html(prettyPrintOne(scope.code));
        });
      }
    };
  });

  /**
   * Used to pretty print code inside a <code> tag. The tag must have a class
   * 'lang-js' or 'lang-javascript' in order to be painted.
   *
   */
  module.directive('code', function() {
    return {
      restrict: 'E',
      compile: function(tElement, attrs) {
        var prettyHtml,
            shouldPaint = /lang-j.*/.test(attrs.class);

        if (shouldPaint) {
          prettyHtml = prettyPrintOne(tElement.html());
        }

        return function(scope, element) {
          if (shouldPaint) {
            element.html(prettyHtml);
          }
        }
      }
    };
  });

  /**
   * Show the child functions.
   */
  module.directive('ptorFunctionList', function() {
    return {
      scope: {
        list: '=ptorFunctionList'
      },
      templateUrl: 'partials/ptor-function-list.html'
    };
  });

  /**
   * Twitter button. Copy pasted from:
   * https://about.twitter.com/resources/buttons#follow
   */
  module.directive('ptorTwitter', function() {
    var showFollowButton = function() {
      var tagName = 'script',
          id = 'twitter-wjs',
          fjs = document.getElementsByTagName(tagName)[0],
          protocol = /^http:/.test(document.location) ? 'http' : 'https';

      if (!document.getElementById(id)) {
        var js = document.createElement(tagName);
        js.id = id;
        js.src = protocol + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
      } else {
        // The twitter script was loaded already.
        window.twttr.widgets.load();
      }
    };

    return {
      link: function() {
        showFollowButton();
      },
      template: '<div class="twitter">' +
      '<a href="https://twitter.com/ProtractorTest" ' +
      'class="twitter-follow-button" data-show-count="false" ' +
      'data-size="large">Follow @ProtractorTest</a></div>'
    };
  });
})();
