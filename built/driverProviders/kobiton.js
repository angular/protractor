"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This is an implementation of the Kobiton Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
var q = require("q");
var logger_1 = require("../logger");
var driverProvider_1 = require("./driverProvider");
var logger = new logger_1.Logger('kobiton');
var Kobiton = /** @class */ (function (_super) {
    __extends(Kobiton, _super);
    function Kobiton(config) {
        return _super.call(this, config) || this;
    }
    /**
     * Configure and launch (if applicable) the object's environment.
     * @return {q.promise} A promise which will resolve when the environment is
     *      ready to test.
     */
    Kobiton.prototype.setupDriverEnv = function () {
        var deferred = q.defer();
        this.config_.capabilities['kobitonUser'] = this.config_.kobitonUser;
        this.config_.capabilities['kobitonKey'] = this.config_.kobitonKey;
        this.config_.seleniumAddress = 'https://' + this.config_.kobitonUser + ':' +
            this.config_.kobitonKey + '@api.kobiton.com/wd/hub';
        logger.info('Using Kobiton selenium server at ' + this.config_.seleniumAddress);
        deferred.resolve();
        return deferred.promise;
    };
    return Kobiton;
}(driverProvider_1.DriverProvider));
exports.Kobiton = Kobiton;
//# sourceMappingURL=kobiton.js.map