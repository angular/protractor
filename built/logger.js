"use strict";
/**
 * Utility functions for command line output logging from Protractor.
 * May be used in different processes, since the launcher spawns
 * child processes for each runner.
 *
 * All logging directly from Protractor, its driver providers, or runners,
 * should go through this file so that it can be customized.
 */
var troubleshoot = false;
function set(config) {
    troubleshoot = config.troubleshoot;
}
exports.set = set;
function print(msg) {
    process.stdout.write(msg);
}
exports.print = print;
function puts() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    console.log.apply(console, args);
}
exports.puts = puts;
function debug(msg) {
    if (troubleshoot) {
        console.log('DEBUG - ' + msg);
    }
}
exports.debug = debug;
function warn(msg) {
    puts('WARNING - ' + msg);
}
exports.warn = warn;
function error(msg) {
    puts('ERROR - ' + msg);
}
exports.error = error;
