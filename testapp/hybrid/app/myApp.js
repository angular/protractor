"use strict";
function ctrl($scope, $timeout) {
    $scope.callCount = 0;
    $scope.clickButton = function () {
        $timeout(function () {
            $scope.callCount++;
        }, 1000);
    };
}
function myApp() {
    return {
        scope: {},
        templateUrl: './html/myApp.html',
        controller: ctrl,
        controllerAs: 'ctrl'
    };
}
exports.myApp = myApp;
//# sourceMappingURL=myApp.js.map