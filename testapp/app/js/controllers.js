'use strict';

/* Controllers */

function FetchCtrl($scope, $http) {
    $scope.method = 'GET';
    $scope.url = '/cafe';
 
    $scope.fetch = function() {
	$scope.code = null;
	$scope.response = null;
 
	$http({method: $scope.method, url: $scope.url}).
	success(function(data, status) {
		$scope.status = status;
		$scope.data = data;
	    }).
	error(function(data, status) {
		$scope.data = data || "Request failed";
		$scope.status = status;
	    });
    };
 
    $scope.updateModel = function(method, url) {
	$scope.method = method;
	$scope.url = url;
    };
}
FetchCtrl.$inject = ['$scope', '$http'];

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2($scope) {
    var bigfoo = [];
    for (var i = 0; i < 2000; i++) {
	bigfoo[i] = {
	    a: i,
	    b: i + " " + i,
	    c: i * i
	}
    }
    $scope.foos = bigfoo;

    $scope.addOne = function() {
	bigfoo.push({
		a: 1, b: '0', c: 'added'});
	console.log("Adding one");
    }
}
MyCtrl2.$inject = ['$scope'];
