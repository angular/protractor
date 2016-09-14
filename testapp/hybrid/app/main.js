"use strict";
var myApp_1 = require('./myApp');
var ng2_1 = require('./ng2');
var ng1_1 = require('./ng1');
var upgrader_1 = require('./upgrader');
var ng1module = angular.module('hybridApp', []);
ng1module.directive('myApp', myApp_1.myApp);
ng1module.directive('ng2', upgrader_1.adapter.downgradeNg2Component(ng2_1.Ng2Component));
ng1module.directive('ng1', ng1_1.ng1Dir);
upgrader_1.adapter.bootstrap(document.body, ['hybridApp']);
//# sourceMappingURL=main.js.map