function ctrl($scope: any, $timeout: any) {
  $scope.callCount = 0;

  $scope.clickButton = function() {
    $timeout(() => {
      $scope.callCount++;
    }, 1000);
  };
}
ctrl.$inject = ['$scope', '$timeout'];

export function Ng1Directive() {
  return {
    scope: {},
    template: '<h3>ng1</h3><button ng-click="clickButton()">Click Count: {{callCount}}</button>',
    controller: ctrl
  };
}

import { Directive, ElementRef, Injector } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
@Directive({
  selector: 'ng1'
})
export class Ng1Component extends UpgradeComponent {
  constructor(elementRef: ElementRef, injector: Injector) {
    super('ng1', elementRef, injector);
  }
}

