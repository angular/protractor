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
      templateUrl: 'partials/ptor-function-list.html'
    }
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
    }
  });
})();
