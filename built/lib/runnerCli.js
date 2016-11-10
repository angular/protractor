/**
 * This serves as the main function for starting a test run that has been
 * requested by the launcher.
 */
"use strict";
var configParser_1 = require('./configParser');
var logger_1 = require('./logger');
var runner_1 = require('./runner');
var logger = new logger_1.Logger('runnerCli');
process.on('message', function (m) {
    switch (m.command) {
        case 'run':
            if (!m.capabilities) {
                throw new Error('Run message missing capabilities');
            }
            // Merge in config file options.
            var configParser = new configParser_1.ConfigParser();
            if (m.configFile) {
                configParser.addFileConfig(m.configFile);
            }
            if (m.additionalConfig) {
                configParser.addConfig(m.additionalConfig);
            }
            var config = configParser.getConfig();
            logger_1.Logger.set(config);
            // Grab capabilities to run from launcher.
            config.capabilities = m.capabilities;
            // Get specs to be executed by this runner
            config.specs = m.specs;
            // Launch test run.
            var runner = new runner_1.Runner(config);
            // Pipe events back to the launcher.
            runner.on('testPass', function () {
                process.send({ event: 'testPass' });
            });
            runner.on('testFail', function () {
                process.send({ event: 'testFail' });
            });
            runner.on('testsDone', function (results) {
                process.send({ event: 'testsDone', results: results });
            });
            runner.run()
                .then(function (exitCode) {
                process.exit(exitCode);
            })
                .catch(function (err) {
                logger.info(err.message);
                process.exit(1);
            });
            break;
        default:
            throw new Error('command ' + m.command + ' is invalid');
    }
});
