angular.module('protractorApp').config(function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html'
      }).
      when('/api', {
        templateUrl: 'partials/api.html',
        controller: 'ApiCtrl'
      }).
      when('/faq', {
        templateUrl: 'partials/faq.html'
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
      when('/frameworks', {
        templateUrl: 'partials/frameworks.html'
      }).
      otherwise({
        redirectTo: '/'
      });
});
