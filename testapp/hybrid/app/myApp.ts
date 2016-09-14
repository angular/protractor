function ctrl($scope: any, $timeout: any) {
  $scope.callCount = 0;

  $scope.clickButton = function() {
    $timeout(() => {
      $scope.callCount++;
    }, 1000);
  };
}

export function myApp() {
  return {
    scope: {},
    templateUrl: './html/myApp.html',
    controller: ctrl,
    controllerAs: 'ctrl'
  };
}
