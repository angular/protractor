var config,
    configParser = require('./configParser');


var init = function() {

  // Launch test run
  testRunner = require(__dirname+'/testRunner.js')(config);

  // Register custom prep/cleanup jobs with testRunner
  if (config.onPrepare) {
    testRunner.registerTestPreparer(config.onPrepare);
  }
  if (config.onCleanup) {
    testRunner.registerTestCleaners(config.onCleanUp);
  }

  testRunner.run();
};


// Merge in config file options
argv = JSON.parse(process.env.optimistArgs);
configParser.addFileConfig(argv._[0]);
configParser.addArgvConfig(argv);
config = configParser.getConfig();

//Grab capability to run from launcher
config.capabilities = JSON.parse(process.env.capability);

init();

