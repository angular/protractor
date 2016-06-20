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
    function myApp() {
        return {
            scope: {},
            templateUrl: './html/myApp.html',
            controller: ctrl,
            controllerAs: 'ctrl'
        };
    }
    exports_1("myApp", myApp);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=myApp.js.map