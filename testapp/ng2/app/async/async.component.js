System.register(['angular2/core', 'angular2/common', 'angular2/src/facade/async'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, async_1;
    var AsyncComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (async_1_1) {
                async_1 = async_1_1;
            }],
        execute: function() {
            AsyncComponent = (function () {
                function AsyncComponent() {
                    this.val1 = 0;
                    this.val2 = 0;
                    this.val3 = 0;
                    this.val4 = 0;
                    this.timeoutId = null;
                    this.multiTimeoutId = null;
                    this.intervalId = null;
                }
                AsyncComponent.prototype.increment = function () { this.val1++; };
                ;
                AsyncComponent.prototype.delayedIncrement = function () {
                    var _this = this;
                    this.cancelDelayedIncrement();
                    this.timeoutId = async_1.TimerWrapper.setTimeout(function () {
                        _this.val2++;
                        _this.timeoutId = null;
                    }, 2000);
                };
                ;
                AsyncComponent.prototype.multiDelayedIncrements = function (i) {
                    this.cancelMultiDelayedIncrements();
                    var self = this;
                    function helper(_i) {
                        if (_i <= 0) {
                            self.multiTimeoutId = null;
                            return;
                        }
                        self.multiTimeoutId = async_1.TimerWrapper.setTimeout(function () {
                            self.val3++;
                            helper(_i - 1);
                        }, 500);
                    }
                    helper(i);
                };
                ;
                AsyncComponent.prototype.periodicIncrement = function () {
                    var _this = this;
                    this.cancelPeriodicIncrement();
                    this.intervalId = async_1.TimerWrapper.setInterval(function () { _this.val4++; }, 2000);
                };
                ;
                AsyncComponent.prototype.cancelDelayedIncrement = function () {
                    if (this.timeoutId != null) {
                        async_1.TimerWrapper.clearTimeout(this.timeoutId);
                        this.timeoutId = null;
                    }
                };
                ;
                AsyncComponent.prototype.cancelMultiDelayedIncrements = function () {
                    if (this.multiTimeoutId != null) {
                        async_1.TimerWrapper.clearTimeout(this.multiTimeoutId);
                        this.multiTimeoutId = null;
                    }
                };
                ;
                AsyncComponent.prototype.cancelPeriodicIncrement = function () {
                    if (this.intervalId != null) {
                        async_1.TimerWrapper.clearInterval(this.intervalId);
                        this.intervalId = null;
                    }
                };
                ;
                AsyncComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/async/async-component.html',
                        directives: [common_1.NgIf]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AsyncComponent);
                return AsyncComponent;
            })();
            exports_1("AsyncComponent", AsyncComponent);
        }
    }
});
//# sourceMappingURL=async.component.js.map