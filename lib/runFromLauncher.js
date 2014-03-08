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
          addConfig(m.additionalConfig).
          getConfig();

      // Grab capability to run from launcher.
      config.capabilities = m.capability;

      // Launch test run.
      var runner = new Runner(config);

      // Pipe events back to the launcher.
      runner.on('testPass', function() {
        process.send({
          event: 'testPass'
        });
      });
      runner.on('testFail', function() {
        process.send({
          event: 'testFail'
        });
      });
      runner.on('testsDone', function(failedCount) {
        process.send({
          event: 'testsDone',
          failedCount: failedCount
        });
      });

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
