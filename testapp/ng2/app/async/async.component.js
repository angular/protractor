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
var AsyncComponent = (function () {
    function AsyncComponent(_ngZone) {
        this._ngZone = _ngZone;
        this.val1 = 0;
        this.val2 = 0;
        this.val3 = 0;
        this.val4 = 0;
        this.val5 = 0;
        this.timeoutId = null;
        this.chainedTimeoutId = null;
        this.intervalId = null;
        this.intervalId_unzoned = null;
    }
    ;
    AsyncComponent.prototype.increment = function () { this.val1++; };
    ;
    AsyncComponent.prototype.delayedIncrement = function () {
        var _this = this;
        this.cancelDelayedIncrement();
        this.timeoutId = setTimeout(function () {
            _this.val2++;
            _this.timeoutId = null;
        }, 2000);
    };
    ;
    AsyncComponent.prototype.chainedDelayedIncrements = function (i) {
        this.cancelChainedDelayedIncrements();
        var self = this;
        function helper(_i) {
            if (_i <= 0) {
                self.chainedTimeoutId = null;
                return;
            }
            self.chainedTimeoutId = setTimeout(function () {
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
        this.intervalId = setInterval(function () { _this.val4++; }, 2000);
    };
    ;
    AsyncComponent.prototype.periodicIncrement_unzoned = function () {
        var _this = this;
        this.cancelPeriodicIncrement_unzoned();
        this._ngZone.runOutsideAngular(function () {
            _this.intervalId_unzoned = setInterval(function () {
                _this._ngZone.run(function () {
                    _this.val5++;
                });
            }, 2000);
        });
    };
    ;
    AsyncComponent.prototype.cancelDelayedIncrement = function () {
        if (this.timeoutId != null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    };
    ;
    AsyncComponent.prototype.cancelChainedDelayedIncrements = function () {
        if (this.chainedTimeoutId != null) {
            clearTimeout(this.chainedTimeoutId);
            this.chainedTimeoutId = null;
        }
    };
    ;
    AsyncComponent.prototype.cancelPeriodicIncrement = function () {
        if (this.intervalId != null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    };
    ;
    AsyncComponent.prototype.cancelPeriodicIncrement_unzoned = function () {
        if (this.intervalId_unzoned != null) {
            clearInterval(this.intervalId_unzoned);
            this.intervalId_unzoned = null;
        }
    };
    ;
    AsyncComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/async/async.component.html',
        }), 
        __metadata('design:paramtypes', [core_1.NgZone])
    ], AsyncComponent);
    return AsyncComponent;
}());
exports.AsyncComponent = AsyncComponent;
//# sourceMappingURL=async.component.js.map