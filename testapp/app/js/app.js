'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/http', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/repeater', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.when('/bindings', {templateUrl: 'partials/bindings.html', controller: BindingsCtrl});
    $routeProvider.when('/form', {templateUrl: 'partials/form.html', controller: FormCtrl});
    $routeProvider.when('/async', {templateUrl: 'partials/async.html', controller: AsyncCtrl});
    $routeProvider.otherwise({redirectTo: '/http'});
  }]);
