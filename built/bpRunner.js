"use strict";
var child_process_1 = require("child_process");
var q = require("q");
var logger_1 = require("./logger");
var BP_PATH = require.resolve('blocking-proxy/built/lib/bin.js');
var logger = new logger_1.Logger('BlockingProxy');
var BlockingProxyRunner = (function () {
    function BlockingProxyRunner(config) {
        this.config = config;
    }
    BlockingProxyRunner.prototype.start = function () {
        var _this = this;
        return q.Promise(function (resolve, reject) {
            _this.checkSupportedConfig();
            var args = [
                '--fork', '--seleniumAddress', _this.config.seleniumAddress, '--rootElement',
                _this.config.rootElement
            ];
            _this.bpProcess = child_process_1.fork(BP_PATH, args, { silent: true });
            logger.info('Starting BlockingProxy with args: ' + args.toString());
            _this.bpProcess
                .on('message', function (data) {
                _this.port = data['port'];
                resolve(data['port']);
            })
                .on('error', function (err) {
                reject(new Error('Unable to start BlockingProxy ' + err));
            })
                .on('exit', function (code, signal) {
                reject(new Error('BP exited with ' + code));
                logger.error('Exited with ' + code);
                logger.error('signal ' + signal);
            });
            _this.bpProcess.stdout.on('data', function (msg) {
                logger.debug(msg.toString().trim());
            });
            _this.bpProcess.stderr.on('data', function (msg) {
                logger.error(msg.toString().trim());
            });
            process.on('exit', function () {
                _this.bpProcess.kill();
            });
        });
    };
    BlockingProxyRunner.prototype.checkSupportedConfig = function () {
        if (this.config.directConnect) {
            throw new Error('BlockingProxy not yet supported with directConnect!');
        }
    };
    return BlockingProxyRunner;
}());
exports.BlockingProxyRunner = BlockingProxyRunner;
//# sourceMappingURL=bpRunner.js.map