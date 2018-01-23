"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ctrl($scope, $timeout) {
    $scope.callCount = 0;
    $scope.clickButton = function () {
        $timeout(function () {
            $scope.callCount++;
        }, 1000);
    };
}
ctrl.$inject = ['$scope', '$timeout'];
exports.ng1module = angular.module('hybrid', []);
exports.ng1module.component('myApp', {
    template: "<h3>ng1</h3><button ng-click=\"clickButton()\">Click Count: {{callCount}}</button>\n             <ng2></ng2>\n            ",
    controller: ctrl
});
//# sourceMappingURL=ng1.js.map