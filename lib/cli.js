var util = require('util');

var args = process.argv.slice(2);

var browsers;
var startWd;
var seleniumAddress;
var testDir;

var printVersion = function () {
  util.puts('Protractor 0.2.1');
  process.exit(0);
};

var runJasmine = function() {
  util.puts('Run the tests');
  // Set up the webdriver (if requrested) using the selenium-webdriver remote.
  // This should be something we can call from jasmine-node instead of a child
  // process.
  var opts = [testDir];
  var jasmineNode = require('child_process').spawn('jasmine-node', opts,
    {stdio: 'inherit'});
}

while(args.length) {
  var arg = args.shift();
  switch(arg) {
    case '--version':
      printVersion();
      break;
    case '--browsers':
      browsers = args.shift().split(',');
      break;
    case '--seleniumAddress':
      seleniumAddress = args.shift();
      break;
    default:
      testDir = arg;
  }
  util.puts(arg);
}

runJasmine();
