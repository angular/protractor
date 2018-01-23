declare var angular: angular.IAngularStatic;

function ctrl($scope: any, $timeout: any) {
  $scope.callCount = 0;

  $scope.clickButton = function() {
    $timeout(() => {
      $scope.callCount++;
    }, 1000);
  };
}
ctrl.$inject = ['$scope', '$timeout'];

export const ng1module = angular.module('hybrid', []);

ng1module.component('myApp', {
  template: `<h3>ng1</h3><button ng-click="clickButton()">Click Count: {{callCount}}</button>
             <ng2></ng2>
            `,
  controller: ctrl
});
