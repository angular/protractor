/**
 * This serves as the main function for starting a test run that has been
 * requested by the launcher.
 */

import {ConfigParser} from './configParser';
import {Logger} from './logger';
import {Runner} from './runner';

let logger = new Logger('runnerCli');

process.on('message', (m: any) => {
  if (m.command === 'run') {
    if (!m.capabilities) {
      throw new Error('Run message missing capabilities');
    }
    // Merge in config file options.
    let configParser = new ConfigParser();
    if (m.configFile) {
      configParser.addFileConfig(m.configFile);
    }
    if (m.additionalConfig) {
      configParser.addConfig(m.additionalConfig);
    }
    let config = configParser.getConfig();
    Logger.set(config);

    // Grab capabilities to run from launcher.
    config.capabilities = m.capabilities;

    // Get specs to be executed by this runner
    config.specs = m.specs;

    // Launch test run.
    let runner = new Runner(config);

    // Pipe events back to the launcher.
    runner.on('testPass', () => {
      process.send({event: 'testPass'});
    });
    runner.on('testFail', () => {
      process.send({event: 'testFail'});
    });
    runner.on('testsDone', (results: any) => {
      process.send({event: 'testsDone', results: results});
    });

    runner.run()
        .then((exitCode: number) => {
          process.exit(exitCode);
        })
        .catch((err: Error) => {
          logger.info(err.message);
          process.exit(1);
        });
  } else {
    throw new Error('command ' + m.command + ' is invalid');
  }
});
