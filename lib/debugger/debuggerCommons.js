var baseDebugger = require('_debugger');
var path = require('path');

/**
 * Create a debugger client and attach to a running protractor process.
 * @param {number} pid Pid of the process to attach the debugger to.
 * @param {number=} opt_port Port to set up the debugger connection over. 
 * @return {!baseDebugger.Client} The connected debugger client.
 */
exports.attachDebugger = function(pid, opt_port) {
  var client = new baseDebugger.Client();
  var port = opt_port || process.debugPort;

  // Call this private function instead of sending SIGUSR1 because Windows.
  process._debugProcess(pid);

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
 * Set a breakpoint for evaluating REPL statements.
 * This sets a breakpoint in Protractor's breakpointhook.js, so that we'll
 * break after executing a command from the REPL.
 */
exports.setEvaluateBreakpoint = function(client, cb) {
  client.setBreakpoint({
    type: 'scriptRegExp',
    target: prepareDebuggerPath('built', 'breakpointhook.js'),
    line: 2
  }, function(err, response) {
    if (err) {
      throw new Error(err);
    }
    cb(response.breakpoint);
  });
};

/**
 * Set a breakpoint for moving forward by one webdriver command.
 * This sets a breakpoint in selenium-webdriver/lib/http.js, and is
 * extremely sensitive to the selenium version. It works for
 * selenium-webdriver 3.0.1
 * This breaks on the following line in http.js:
 *      let request = buildRequest(this.customCommands_, this.w3c, command);
 * And will need to break at a similar point in future selenium-webdriver
 * versions.
 */
exports.setWebDriverCommandBreakpoint = function(client, cb) {
  client.setBreakpoint({
    type: 'scriptRegExp',
    target: prepareDebuggerPath('lib', 'http.js'),
    line: 433
  }, function(err, response) {
    if (err) {
      throw new Error(err);
    }
    cb(response.breakpoint);
  });
};

/**
 * Create a cross-platform friendly path for setting scriptRegExp breakpoints.
 */
function prepareDebuggerPath(...parts) {
  return path.join(...parts)
    .replace('\\', '\\\\')
    .replace('.', '\\.');
}

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
