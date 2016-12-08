"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var static_1 = require('@angular/upgrade/static');
var myApp_1 = require('./myApp');
var ng2_1 = require('./ng2');
var ng1_1 = require('./ng1');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule.prototype.ngDoBootstrap = function () { };
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                static_1.UpgradeModule
            ],
            declarations: [
                ng2_1.Ng2Component,
                ng1_1.Ng1Component,
            ],
            entryComponents: [
                ng2_1.Ng2Component
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
angular.module('upgradeApp', [])
    .directive('ng1', ng1_1.Ng1Directive)
    .directive('ng2', static_1.downgradeComponent({
    component: ng2_1.Ng2Component,
}))
    .directive('myApp', myApp_1.RootDirective);
//# sourceMappingURL=module.js.map