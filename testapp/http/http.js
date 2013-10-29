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
