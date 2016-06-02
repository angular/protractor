System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    exports_1("ng1", ng1);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=ng1.js.map