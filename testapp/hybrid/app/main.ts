import {myApp} from './myApp'
import {Ng2Component} from './ng2'
import {ng1Dir} from './ng1'
import {adapter} from './upgrader';

declare var angular;

var ng1module = angular.module('hybridApp', []);

ng1module.directive('myApp', myApp);
ng1module.directive('ng2', adapter.downgradeNg2Component(Ng2Component));
ng1module.directive('ng1', ng1Dir);

adapter.bootstrap(document.body, ['hybridApp']);
