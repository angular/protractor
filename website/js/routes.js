angular.module('protractorApp').config(function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html'
      }).
      when('/api', {
        templateUrl: 'partials/api.html',
        controller: 'ApiCtrl'
      }).
      when('/tutorial', {
        templateUrl: 'partials/tutorial.html'
      }).
      otherwise({
        redirectTo: '/'
      });
});
