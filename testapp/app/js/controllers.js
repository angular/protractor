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
  function fib(n) {
    if (n <= 1) return 1;
    return fib(n - 1) + fib(n - 2);
  }

  $scope.foos = [];
  for (var i = 0; i < 35; i++) {
    $scope.foos[i] = {
      a: i,
      b: fib(i),
    };
  }

  $scope.addOne = function() {
    $scope.foos.push({
      a: $scope.foos.length,
      b: fib($scope.foos.length)
    });
  };
}

MyCtrl2.$inject = ['$scope'];

function BindingsCtrl($scope) {
  $scope.planets = [
    { name: "Mercury",
      radius: 1516
    },
    { name: "Venus",
      radius: 3760
    },
    { name: "Earth",
      radius: 3959,
      moons: ["Luna"]
    },
    { name: "Mars",
      radius: 2106,
      moons: ["Phobos", "Deimos"]
    },
    { name: "Jupiter",
      radius: 43441,
      moons: ["Europa", "Io", "Ganymede", "Castillo"]
    },
    { name: "Saturn",
      radius: 36184,
      moons: ["Titan", "Rhea", "Iapetus", "Dione"]
    },
    { name: "Uranus",
      radius: 15759,
      moons: ["Titania", "Oberon", "Umbriel", "Ariel"]
    },
    { name: "Neptune",
      radius: 15299,
      moons: ["Triton", "Proteus", "Nereid", "Larissa"]
    }
  ];

  $scope.planet = $scope.planets[0];

  $scope.getRadiusKm = function() {
    return $scope.planet.radius * 0.6213;
  };
}
BindingsCtrl.$inject = ['$scope'];

function FormCtrl($scope) {
  $scope.greeting = "Hiya";
  $scope.username = "Anon";
  $scope.color = "blue";
  $scope.show = true;
  $scope.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
}
FormCtrl.$inject = ['$scope'];

function AsyncCtrl($scope, $http, $timeout) {
  $scope.slowHttpStatus = 'not started';
  $scope.slowFunctionStatus = 'not started';
  $scope.slowTimeoutStatus = 'not started';
  $scope.slowAngularTimeoutStatus = 'not started';
  $scope.slowAngularTimeoutPromiseStatus = 'not started';
  $scope.slowHttpPromiseStatus = 'not started';

  $scope.slowHttp = function() {
    $scope.slowHttpStatus = 'pending...';
    $http({method: 'GET', url: '/slowcall'}).success(function() {
      $scope.slowHttpStatus = 'done';
    })
  };

  $scope.slowFunction = function() {
    $scope.slowFunctionStatus = 'pending...';
    for (var i = 0, t = 0; i < 1000000000; ++i) {
      t++;
    }
    $scope.slowFunctionStatus = 'done';
  }

  $scope.slowTimeout = function() {
    $scope.slowTimeoutStatus = 'pending...';
    window.setTimeout(function() {
      $scope.$apply(function() {
        $scope.slowTimeoutStatus = 'done';
      });
    }, 2000);
  };

  $scope.slowAngularTimeout = function() {
    $scope.slowAngularTimeoutStatus = 'pending...';
    $timeout(function() {
      $scope.slowAngularTimeoutStatus = 'done';
    }, 2000);
  };

  $scope.slowAngularTimeoutPromise = function() {
    $scope.slowAngularTimeoutPromiseStatus = 'pending...';
    $timeout(function() {
      // intentionally empty
    }, 2000).then(function() {
      $scope.slowAngularTimeoutPromiseStatus = 'done';
    });
  };

  $scope.slowHttpPromise = function() {
    $scope.slowHttpPromiseStatus = 'pending...';
    $http({method: 'GET', url: '/slowcall'}).success(function() {
      // intentionally empty
    }).then(function() {
      $scope.slowHttpPromiseStatus = 'done';
    });
  }
};
AsyncCtrl.$inject = ['$scope', '$http', '$timeout'];
