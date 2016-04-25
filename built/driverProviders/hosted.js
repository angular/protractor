"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 *  This is an implementation of the Hosted Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
var q = require('q');
var driverProvider_1 = require('./driverProvider');
var logger2_1 = require('../logger2');
var logger = new logger2_1.Logger('hosted');
var Hosted = (function (_super) {
    __extends(Hosted, _super);
    function Hosted(config) {
        _super.call(this, config);
    }
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    Hosted.prototype.setupEnv = function () {
        logger.info('Using the selenium server at ' + this.config_.seleniumAddress);
        return q.fcall(function () { });
    };
    return Hosted;
}(driverProvider_1.DriverProvider));
exports.Hosted = Hosted;
