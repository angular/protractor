angular.module('protractorApp').config(function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html'
      }).
      when('/api', {
        templateUrl: 'partials/api.html',
        controller: 'ApiCtrl',
        reloadOnSearch: false
      }).
      when('/api-overview', {
        templateUrl: 'partials/api-overview.html'
      }).
      when('/browser-setup', {
        templateUrl: 'partials/browser-setup.html'
      }).
      when('/control-flow', {
        templateUrl: 'partials/control-flow.html'
      }).
      when('/debugging', {
        templateUrl: 'partials/debugging.html'
      }).
      when('/faq', {
        templateUrl: 'partials/faq.html'
      }).
      when('/frameworks', {
        templateUrl: 'partials/frameworks.html'
      }).
      when('/getting-started', {
        templateUrl: 'partials/getting-started.html'
      }).
      when('/infrastructure', {
        templateUrl: 'partials/infrastructure.html'
      }).
      when('/locators', {
        templateUrl: 'partials/locators.html'
      }).
      when('/page-objects', {
        templateUrl: 'partials/page-objects.html'
      }).
      when('/protractor-setup', {
        templateUrl: 'partials/protractor-setup.html'
      }).
      when('/server-setup', {
        templateUrl: 'partials/server-setup.html'
      }).
      when('/system-setup', {
        templateUrl: 'partials/system-setup.html'
      }).
      when('/timeouts', {
        templateUrl: 'partials/timeouts.html'
      }).
      when('/toc', {
        templateUrl: 'partials/toc.html'
      }).
      when('/tutorial', {
        templateUrl: 'partials/tutorial.html'
      }).
      otherwise({
        redirectTo: '/'
      });
});
