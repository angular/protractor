function ConflictCtrl($scope) {
  $scope.item = {
    reusedBinding: 'outer',
    alsoReused: 'outerbarbaz'
  }

  $scope.wrapper = [{
    resuedBinding: 'inner',
    alsoReused: 'innerbarbaz'
  }]
};
ConflictCtrl.$inject = ['$scope'];
