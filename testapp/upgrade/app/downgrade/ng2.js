"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/platform-browser/animations");
var static_1 = require("@angular/upgrade/static");
var ng1_1 = require("./ng1");
var Ng2Component = /** @class */ (function () {
    function Ng2Component() {
        var _this = this;
        this.callCount = 0;
        this.clickButton = function () {
            setTimeout(function () {
                _this.callCount++;
            }, 1000);
        };
    }
    Ng2Component.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ng2',
                    template: "\n    <h2>ng2</h2>\n    <button (click)='clickButton()'>Click Count: {{callCount}}</button>\n  "
                },] },
    ];
    /** @nocollapse */
    Ng2Component.ctorParameters = function () { return []; };
    return Ng2Component;
}());
exports.Ng2Component = Ng2Component;
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.prototype.ngDoBootstrap = function () { };
    AppModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        animations_1.BrowserAnimationsModule,
                    ],
                    declarations: [
                        Ng2Component,
                    ],
                    entryComponents: [
                        Ng2Component
                    ]
                },] },
    ];
    /** @nocollapse */
    AppModule.ctorParameters = function () { return []; };
    return AppModule;
}());
exports.AppModule = AppModule;
// Register the Angular 2 component with the Angular 1 module.
ng1_1.ng1module.directive('ng2', // lowerCamel when registering.
// propagateDigest: false will detach the digest cycle from AngularJS from
// propagating into the Angular (2+) CD.
static_1.downgradeComponent({ component: Ng2Component, propagateDigest: false }));
//# sourceMappingURL=ng2.js.map