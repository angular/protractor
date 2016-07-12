System.register(['@angular/core', './upgrader'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, upgrader_1;
    var Ng2Component, ng2;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (upgrader_1_1) {
                upgrader_1 = upgrader_1_1;
            }],
        execute: function() {
            Ng2Component = (function () {
                function Ng2Component() {
                    var _this = this;
                    this.callCount = 0;
                    this.clickButton = function () {
                        setTimeout(function () {
                            _this.callCount++;
                        }, 1000);
                    };
                }
                Ng2Component = __decorate([
                    core_1.Component({
                        selector: 'ng2',
                        templateUrl: './html/ng2.html',
                        directives: [upgrader_1.adapter.upgradeNg1Component('ng1')]
                    }), 
                    __metadata('design:paramtypes', [])
                ], Ng2Component);
                return Ng2Component;
            }());
            exports_1("ng2", ng2 = upgrader_1.adapter.downgradeNg2Component(Ng2Component));
        }
    }
});
//# sourceMappingURL=ng2.js.map