angular.module('protractorApp').config(function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html'
      }).
      when('/api', {
        templateUrl: 'partials/api.html',
        controller: 'ApiCtrl'
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
      when('/faq', {
        templateUrl: 'partials/faq.html'
      }).
      when('/getting-started', {
        templateUrl: 'partials/getting-started.html'
      }).
      when('/tutorial', {
        templateUrl: 'partials/tutorial.html'
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
      when('/frameworks', {
        templateUrl: 'partials/frameworks.html'
      }).
      when('/timeouts', {
        templateUrl: 'partials/timeouts.html'
      }).
      otherwise({
        redirectTo: '/'
      });
});
