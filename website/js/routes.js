angular.module('protractorApp').config(function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'MarkdownCtrl'
      }).
      when('/api', {
        templateUrl: 'partials/api.html',
        controller: 'ApiCtrl',
        reloadOnSearch: false
      }).
      when('/style-guide', {
        templateUrl: 'partials/style-guide.html',
        controller: 'MarkdownCtrl'
      }).
      when('/webdriver-vs-protractor', {
        templateUrl: 'partials/webdriver-vs-protractor.html',
        controller: 'MarkdownCtrl'
      }).
      when('/api-overview', {
        templateUrl: 'partials/api-overview.html',
        controller: 'MarkdownCtrl'
      }).
      when('/browser-setup', {
        templateUrl: 'partials/browser-setup.html',
        controller: 'MarkdownCtrl'
      }).
      when('/browser-support', {
        templateUrl: 'partials/browser-support.html',
        controller: 'MarkdownCtrl'
      }).
      when('/plugins', {
        templateUrl: 'partials/plugins.html',
        controller: 'MarkdownCtrl'
      }).
      when('/control-flow', {
        templateUrl: 'partials/control-flow.html',
        controller: 'MarkdownCtrl'
      }).
      when('/debugging', {
        templateUrl: 'partials/debugging.html',
        controller: 'MarkdownCtrl'
      }).
      when('/faq', {
        templateUrl: 'partials/faq.html',
        controller: 'MarkdownCtrl'
      }).
      when('/frameworks', {
        templateUrl: 'partials/frameworks.html',
        controller: 'MarkdownCtrl'
      }).
      when('/getting-started', {
        templateUrl: 'partials/getting-started.html',
        controller: 'MarkdownCtrl'
      }).
      when('/infrastructure', {
        templateUrl: 'partials/infrastructure.html',
        controller: 'MarkdownCtrl'
      }).
      when('/locators', {
        templateUrl: 'partials/locators.html',
        controller: 'MarkdownCtrl'
      }).
      when('/page-objects', {
        templateUrl: 'partials/page-objects.html',
        controller: 'MarkdownCtrl'
      }).
      when('/protractor-setup', {
        templateUrl: 'partials/protractor-setup.html',
        controller: 'MarkdownCtrl'
      }).
      when('/server-setup', {
        templateUrl: 'partials/server-setup.html',
        controller: 'MarkdownCtrl'
      }).
      when('/system-setup', {
        templateUrl: 'partials/system-setup.html',
        controller: 'MarkdownCtrl'
      }).
      when('/timeouts', {
        templateUrl: 'partials/timeouts.html',
        controller: 'MarkdownCtrl'
      }).
      when('/toc', {
        templateUrl: 'partials/toc.html',
        controller: 'MarkdownCtrl'
      }).
      when('/tutorial', {
        templateUrl: 'partials/tutorial.html',
        controller: 'MarkdownCtrl'
      }).
      when('/jasmine-upgrade', {
        templateUrl: 'partials/jasmine-upgrade.html',
        controller: 'MarkdownCtrl'
      }).
      when('/mobile-setup', {
        templateUrl: 'partials/mobile-setup.html',
        controller: 'MarkdownCtrl'
      }).
      when('/typescript', {
        templateUrl: 'partials/typescript.html',
        controller: 'MarkdownCtrl'
      }).
      when('/async-await', {
        templateUrl: 'partials/async-await.html',
        controller: 'MarkdownCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
});
