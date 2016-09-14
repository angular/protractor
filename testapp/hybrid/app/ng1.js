"use strict";
function ctrl($scope, $timeout) {
    $scope.callCount = 0;
    $scope.clickButton = function () {
        $timeout(function () {
            $scope.callCount++;
        }, 1000);
    };
}
function ng1() {
    return {
        scope: {},
        templateUrl: './html/ng1.html',
        controller: ctrl,
        controllerAs: 'ctrl'
    };
}
exports.ng1 = ng1;
//# sourceMappingURL=ng1.js.map