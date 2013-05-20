'use strict';

/* Controllers */

function FetchCtrl($scope, $http) {
  $scope.method = 'GET';
  $scope.url = '/fastcall';
 
  $scope.fetch = function() {
    $scope.status = null;
    $scope.data = null;
 
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
  var formatNum = function(num) {
    var string =  num.toString();
    var triplets = [''];
    while (string.length > 3) {
      triplets.push(string.substr(-3));
      string = string.substr(0, string.length - 3);
    }
    return string + (triplets.length > 1 ? triplets.join(',') : '');
  };
  var bigfoo = [];
  for (var i = 0; i < 2500; i+=5) {
    bigfoo[i] = {
      a: i,
      b: formatNum(i),
      c: formatNum(i * i)
    };
  }
  $scope.foos = bigfoo;

  $scope.addOne = function() {
    bigfoo.push({
      a: bigfoo.length, b: 'new', c: 'entry'});
  };
}
MyCtrl2.$inject = ['$scope'];

function BindingsCtrl($scope) {
  $scope.planets = [
    { name: "Mercury",
      radius: 1516
    },
    { name: "Venus",
      radius: 3760,
      moons: ["Europa", "Io", "Ganymede", "Castillo"]
    },
    { name: "Earth",
      radius: 3959,
      moons: ["Moon"]
    },
    { name: "Mars",
      radius: 2106,
      moons: ["Phobos", "Deimos"]
    },
    { name: "Jupiter",
      radius: 43441,
      moons: ["Europa", "Io", "Ganymede", "Castillo"]
    }
  ];

  $scope.planet = $scope.planets[0];

  $scope.getRadiusKm = function() {
    return $scope.planet.radius * 0.6213;
  };
}
BindingsCtrl.$inject = ['$scope'];
