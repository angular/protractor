var baseDebugger = require('_debugger');

/**
 * Create a debugger client and attach to a running protractor process.
 * Set a break point at webdriver executor. 
 * @param {number} pid Pid of the process to attach the debugger to.
 * @param {number=} opt_port Port to set up the debugger connection over. 
 * @return {!baseDebugger.Client} The connected debugger client.
 */
exports.attachDebugger = function(pid, opt_port) {
  var client = new baseDebugger.Client();
  var port = opt_port || process.debugPort;

  // Call this private function instead of sending SIGUSR1 because Windows.
  process._debugProcess(pid);

  client.once('ready', function() {
    client.setBreakpoint({
      type: 'scriptRegExp',
      target: '.*command\.js', //jshint ignore:line
      line: 249
    }, function() {
      process.send('ready');
      client.reqContinue(function() {
        // Intentionally blank.
      });
    });
  });

  // Connect to debugger on port with retry 200ms apart.
  var connectWithRetry = function(attempts) {
    client.connect(port, 'localhost')
        .on('error', function(e) {
          if (attempts === 1) {
            throw e;
          } else {
            setTimeout(function() {
              connectWithRetry(attempts - 1);
            }, 200);
          }
        });
  };
  connectWithRetry(10);

  return client;
};

/**
 * Trim excess symbols from the repl command so that it is consistent with
 * the user input. 
 * @param {string} cmd Cmd provided by the repl server.
 * @return {string} The trimmed cmd.
 */
exports.trimReplCmd = function(cmd) {
  // Given user input 'foobar', some versions of node provide '(foobar\n)',
  // while other versions of node provide 'foobar\n'. 
  if (cmd.length >= 2 && cmd[0] === '(' && cmd[cmd.length - 1] === ')') {
    cmd = cmd.substring(1, cmd.length - 1);
  }
  return cmd.slice(0, cmd.length - 1);
};
