'use strict';

angular.module('protractorApp', ['ngRoute'])
  .run(['$rootScope', function($rootScope){
    const now = new Date().getTime()
    $rootScope.isEOL = (now >= new Date('2023-09-01T00:00:00'));
    $rootScope.isEOCS = (now >= new Date('2024-09-01T00:00:00'));
  }]);
