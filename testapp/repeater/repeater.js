function RepeaterCtrl($scope) {
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

RepeaterCtrl.$inject = ['$scope'];
