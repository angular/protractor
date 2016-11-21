"use strict";
function ctrl($scope, $timeout) {
    $scope.callCount = 0;
    $scope.clickButton = function () {
        $timeout(function () {
            $scope.callCount++;
        }, 1000);
    };
}
ctrl.$inject = ['$scope', '$timeout'];
function RootDirective() {
    return {
        scope: {},
        templateUrl: './html/myApp.html',
        controller: ctrl
    };
}
exports.RootDirective = RootDirective;
//# sourceMappingURL=myApp.js.map