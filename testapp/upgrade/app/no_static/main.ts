import {RootDirective} from '../myApp'
import {Ng2Component} from '../ng2'
import {Ng1Directive} from '../ng1'
import {adapter} from './upgrader';

declare var angular;

var ng1module = angular.module('upgradeApp', []);

ng1module.directive('myApp', RootDirective);
ng1module.directive('ng2', adapter.downgradeNg2Component(Ng2Component));
ng1module.directive('ng1', Ng1Directive);

adapter.bootstrap(document.body, ['upgradeApp']);
