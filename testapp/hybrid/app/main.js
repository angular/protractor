System.register(['./myApp', './ng2', './ng1', './upgrader'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var myApp_1, ng2_1, ng1_1, upgrader_1;
    var ng1module;
    return {
        setters:[
            function (myApp_1_1) {
                myApp_1 = myApp_1_1;
            },
            function (ng2_1_1) {
                ng2_1 = ng2_1_1;
            },
            function (ng1_1_1) {
                ng1_1 = ng1_1_1;
            },
            function (upgrader_1_1) {
                upgrader_1 = upgrader_1_1;
            }],
        execute: function() {
            ng1module = angular.module('hybridApp', []);
            ng1module.directive('myApp', myApp_1.myApp);
            ng1module.directive('ng2', ng2_1.ng2);
            ng1module.directive('ng1', ng1_1.ng1);
            upgrader_1.adapter.bootstrap(document.body, ['hybridApp']);
        }
    }
});
//# sourceMappingURL=main.js.map