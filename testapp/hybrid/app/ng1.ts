function ctrl($scope: any, $timeout: any) {
  $scope.callCount = 0;

  $scope.clickButton = function() {
    $timeout(() => {
      $scope.callCount++;
    }, 1000);
  };
}

export function ng1() {
  return {
    scope: {},
    templateUrl: './html/ng1.html',
    controller: ctrl,
    controllerAs: 'ctrl'
  };
}
