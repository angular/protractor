function WindowCtrl($scope, $window) {
  $scope.doAlert = function() {
    $window.alert('Hello');
  };
}
WindowCtrl.$inject = ['$scope', '$window'];
