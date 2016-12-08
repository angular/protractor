function ctrl($scope: any, $timeout: any) {
  $scope.callCount = 0;

  $scope.clickButton = function() {
    $timeout(() => {
      $scope.callCount++;
    }, 1000);
  };
}
ctrl.$inject = ['$scope', '$timeout'];

export function RootDirective() {
  return {
    scope: {},
    templateUrl: './html/myApp.html',
    controller: ctrl
  };
}
