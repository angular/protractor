import * as angular from 'angular2/src/upgrade/angular_js';
import {myApp} from './myApp'
import {ng2} from './ng2'
import {ng1} from './ng1'
import {adapter} from './upgrader';

var ng1module = angular.module('hybridApp', []);

ng1module.directive('myApp', myApp);
ng1module.directive('ng2', ng2);
ng1module.directive('ng1', ng1);

adapter.bootstrap(document.body, ['hybridApp']);
