/**
 * This serves as the main function for starting a test run that has been
 * requested by the launcher.
 */

var ConfigParser = require('./configParser');
var Runner = require('./runner');

var config, argv;

process.on('message', function(m) {
  switch (m.command) {
    case 'run':
      if (!m.capability) {
        throw new Error('Run message missing capability');
      }
      if (!m.cliArgs) {
        throw new Error('Run message missing cliArgs');
      }
      // Merge in config file options.
      argv = m.cliArgs;
      config = new ConfigParser().
          addFileConfig(argv._[0]).
          addConfig(argv).
          getConfig();

      // Grab capability to run from launcher.
      config.capabilities = m.capability;

      // Launch test run.
      var runner = new Runner(config);
      runner.run().then(function(exitCode) {
        process.exit(exitCode);
      }).catch(function(err) {
        console.log(err.message);
        process.exit(1);
      });
      break;
    default:
      throw new Error('command ' + m.command + ' is invalid');
  }
});
