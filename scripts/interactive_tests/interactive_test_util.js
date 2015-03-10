var child_process = require('child_process'),
    q = require('q'),
    net = require('net');

var TIMEOUT = 10000;

// An instance of a protractor debugger server.
var Server = function(serverStartCmd, port) {
  // Start protractor and its debugger server as a child process.
  this.start = function() {
    var deferred = q.defer();
    var received = '';

    serverStartCmd += ' --debuggerServerPort ' + port;
    serverStartCmd = serverStartCmd.split(/\s/);
    var test_process = child_process.spawn(serverStartCmd[0], 
      serverStartCmd.slice(1));

    var timeoutObj = setTimeout(function() {
      var errMsg = 'Did not start interactive server in ' + TIMEOUT/1000 + 's.';
      if (received) {
        errMsg += ' Server startup output: ' + received;
      }
      deferred.reject(errMsg);
    }, TIMEOUT);
    
    test_process.stdout.on('data', function(data) {
      received += data;
      if (received.indexOf('Server listening on 127.0.0.1:' + port) >= 0) {
        clearTimeout(timeoutObj);
        // Add a small time for browser to get ready
        setTimeout(deferred.resolve, 2000);
      }
    });

    test_process.stderr.on('data', function(data) {
      received += data;
    });

    return deferred.promise;
  };
};

// A client to attach to Protractor's debugger server and exchange data. 
var Client = function(port) {
  var socket;

  // Connect to the server. 
  this.connect = function() {
    var deferred = q.defer();
    socket = net.connect({port: port}, function() {
      deferred.resolve();
    });
    return deferred.promise;
  };

  // Disconnect from the server.
  this.disconnect = function() {
    socket.end();
  };

  // Send a command to the server and wait for a response. Return response as a 
  // promise. 
  this.sendCommand = function(cmd) {
    var deferred = q.defer();
    var received = '';
    var timeoutObj = setTimeout(function() {
      var errMsg = 'Command <' + JSON.stringify(cmd) + 
          '> did not receive a response in ' + TIMEOUT/1000 + 's.';
      if (received) {
        errMsg += ' Received messages so far: ' + received;
      }
      deferred.reject(errMsg);
    }, TIMEOUT);

    var ondata = function(data) {
      received += data.toString();
      var i = received.indexOf('\r\n');
      if (i >= 0) {
        clearTimeout(timeoutObj);
        var response = received.substring(0, i).trim();
        deferred.resolve(response);
      }
    };
    socket.on('data', ondata);

    var onerror = function(data) {
      deferred.reject('Received error: ' + data);
    };
    socket.on('error', onerror);

    socket.write(cmd + '\r\n');
    return deferred.promise.fin(function() {
      clearTimeout(timeoutObj);
      socket.removeListener('data', ondata);
      socket.removeListener('error', onerror);
    });
  };
};

/**
 * Util for running an interactive Protractor test.
 */
exports.InteractiveTest = function(interactiveServerStartCmd, port) {
  var expectations = [];

  // Adds a command to send as well as the response to verify against. 
  // If opt_expectedResult is undefined, the test will still wait for the server
  // to respond after sending the command, but will not verify against it.
  // Note, this does not actually interact with the server, but simply adds the 
  // command to a queue.
  this.addCommandExpectation = function(command, opt_expectedResult) {
    expectations.push({
      command: command,
      expectedResult: opt_expectedResult
    });
  };

  // Execute the interactive test. This will first start Protractor and its
  // debugger server. Then it will connect to the server. Finally, it will 
  // send the queue of commands against the server sequentially and verify the
  // response from the server if needed. 
  this.run = function() {
    var server = new Server(interactiveServerStartCmd, port);
    return server.start().then(function() {
      var client = new Client(port);
      return client.connect().then(function() {
        var verifyAll = function(i) {
          if (i < expectations.length) {
            var expectedResult = expectations[i].expectedResult;
            var command = expectations[i].command;
            return client.sendCommand(command).then(function(response) {
              if (expectedResult !== undefined && expectedResult !== response) {
                throw ('Command <' + JSON.stringify(command) + '> received: ' + 
                    response + ', but expects: ' + expectedResult);
              } else {
                return verifyAll(i + 1);
              }
            });
          }
        };
        return verifyAll(0);
      }).fin(function() {
        // '^]' This is the term signal.
        client.sendCommand(String.fromCharCode(0x1D)); 
        client.disconnect();
      });
    }).done();
  };
};
