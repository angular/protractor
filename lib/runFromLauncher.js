/**
 * This serves as the main function for starting a test run that has been
 * requested by the launcher. It assumes that the process environment has
 * been set with the following properties:
 *   cliArgs - a stringified JSON object representing the CLI args passed
 *             to this test run.
 *   capability - a stringified JSON object representing the particular
 *                capability to be used for this run.
 *   numNumber - an identifier for this run, in case multiple runs of the same
 *               capability were requested.
 */

var ConfigParser = require('./configParser');
var Runner = require('./runner');

var config, argv;

// Merge in config file options.
argv = JSON.parse(process.env.cliArgs);
config = new ConfigParser().
    addFileConfig(argv._[0]).
    addConfig(argv).
    getConfig();

// Grab capability to run from launcher.
config.capabilities = JSON.parse(process.env.capability);

// Launch test run.
var runner = new Runner(config);
runner.run().then(function(exitCode) {
  process.exit(exitCode);
});
