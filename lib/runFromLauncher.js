/**
 * This serves as the main function for starting a test run that has been
 * requested by the launcher.
 */

var ConfigParser = require('./configParser');
var Runner = require('./runner');

process.on('message', function(m) {
  switch (m.command) {
    case 'run':
      if (!m.capability) {
        throw new Error('Run message missing capability');
      }
      // Merge in config file options.
      var configParser = new ConfigParser();
      if (m.configFile) {
        configParser.addFileConfig(m.configFile);
      }
      if (m.additionalConfig) {
        configParser.addConfig(m.additionalConfig);
      }
      var config = configParser.getConfig();

      // Grab capability to run from launcher.
      config.capabilities = m.capability;

      //Get specs to be executed by this runner
      config.specs = m.specs;

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
