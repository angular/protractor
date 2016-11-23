"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function ctrl($scope, $timeout) {
    $scope.callCount = 0;
    $scope.clickButton = function () {
        $timeout(function () {
            $scope.callCount++;
        }, 1000);
    };
}
ctrl.$inject = ['$scope', '$timeout'];
function Ng1Directive() {
    return {
        scope: {},
        template: '<h3>ng1</h3><button ng-click="clickButton()">Click Count: {{callCount}}</button>',
        controller: ctrl
    };
}
exports.Ng1Directive = Ng1Directive;
var core_1 = require('@angular/core');
var static_1 = require('@angular/upgrade/static');
var Ng1Component = (function (_super) {
    __extends(Ng1Component, _super);
    function Ng1Component(elementRef, injector) {
        _super.call(this, 'ng1', elementRef, injector);
    }
    Ng1Component = __decorate([
        core_1.Directive({
            selector: 'ng1'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Injector])
    ], Ng1Component);
    return Ng1Component;
}(static_1.UpgradeComponent));
exports.Ng1Component = Ng1Component;
//# sourceMappingURL=ng1.js.map