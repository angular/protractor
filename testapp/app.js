'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute', 'myApp.appVersion']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/repeater', {templateUrl: 'repeater/repeater.html', controller: RepeaterCtrl});
    $routeProvider.when('/bindings', {templateUrl: 'bindings/bindings.html', controller: BindingsCtrl});
    $routeProvider.when('/form', {templateUrl: 'form/form.html', controller: FormCtrl});
    $routeProvider.when('/async', {templateUrl: 'async/async.html', controller: AsyncCtrl});
    $routeProvider.when('/conflict', {templateUrl: 'conflict/conflict.html', controller: ConflictCtrl});
    $routeProvider.when('/polling', {templateUrl: 'polling/polling.html', controller: PollingCtrl});
    $routeProvider.when('/slowloader', {
      templateUrl: 'polling/polling.html',
      controller: PollingCtrl,
      resolve: {
        slow: function($timeout) {
          return $timeout(function() {}, 2000);
        }
      }
    });
    $routeProvider.otherwise({redirectTo: '/form'});
  }]);
