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
var upgrade_1 = require('@angular/upgrade');
var platform_browser_1 = require('@angular/platform-browser');
var core_1 = require('@angular/core');
var ng2_1 = require('../ng2');
exports.adapter = new upgrade_1.UpgradeAdapter(core_1.forwardRef(function () { return Ng2Module; }));
var Ng2Module = (function () {
    function Ng2Module() {
    }
    Ng2Module = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule
            ],
            declarations: [
                ng2_1.Ng2Component, exports.adapter.upgradeNg1Component('ng1')
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], Ng2Module);
    return Ng2Module;
}());
exports.Ng2Module = Ng2Module;
//# sourceMappingURL=upgrader.js.map