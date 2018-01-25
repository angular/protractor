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
 * This is an implementation of the TestObject Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
var q = require("q");
var logger_1 = require("../logger");
var driverProvider_1 = require("./driverProvider");
var logger = new logger_1.Logger('testobject');
var TestObject = /** @class */ (function (_super) {
    __extends(TestObject, _super);
    function TestObject(config) {
        return _super.call(this, config) || this;
    }
    /**
     * Configure and launch (if applicable) the object's environment.
     * @return {q.promise} A promise which will resolve when the environment is
     *      ready to test.
     */
    TestObject.prototype.setupDriverEnv = function () {
        var deferred = q.defer();
        this.config_.capabilities['testobject.user'] = this.config_.testobjectUser;
        this.config_.capabilities['testobject_api_key'] = this.config_.testobjectKey;
        this.config_.seleniumAddress = 'https://us1.appium.testobject.com/wd/hub';
        logger.info('Using TestObject selenium server at ' + this.config_.seleniumAddress);
        deferred.resolve();
        return deferred.promise;
    };
    return TestObject;
}(driverProvider_1.DriverProvider));
exports.TestObject = TestObject;
//# sourceMappingURL=testObject.js.map