const child_process = require('child_process');
const net = require('net');

const TIMEOUT = 10000;

// An instance of a protractor debugger server.
const Server = function(serverStartCmd, port) {
  // Start protractor and its debugger server as a child process. Return promise.
  this.start = () => {
    return new Promise((resolve, reject) => {
      // serverStartCmd += ' --debuggerServerPort ' + port;
      // serverStartCmd = serverStartCmd.split(/\s/);
      // var test_process = child_process.spawn(serverStartCmd[0], serverStartCmd.slice(1));

      const commands = `${serverStartCmd} --debuggerServerPort ${port}`.split(/\s/);
      const command = commands[0];
      const arguments = commands.slice(1);
      const test_process = child_process.spawn(command, arguments);
      let received = '';

      const timeout = setTimeout(() => {
        let errorMessage = `Did not start interactive server in ${TIMEOUT/1000}'s.`;
        if (received) {
          errorMessage += ` Server startup output: ' + ${received}`;
        }
        reject(errorMessage);
      }, TIMEOUT);

      test_process.stdout.on('data', (data) => {
        received += data;
        if (received.indexOf(`Server listening on 127.0.0.1:${port}`) !== -1) {
          clearTimeout(timeout);
          // Add a small time for browser to get ready
          setTimeout(resolve(), 2000);
        }
      });

      test_process.stderr.on('data', (data) => {
        received += data;
      });
    });
  };
};

// A client to attach to Protractor's debugger server and exchange data.
const Client = function(port) {
  let socket;

  // Connect to the server. Return promise.
  this.connect = () => {
    return new Promise(resolve => {
      socket = net.connect({port: port}, () => {
        resolve();
      });
    });
  };

  // Disconnect from the server. Return void.
  this.disconnect = function() {
    socket.end();
  };

  // Send a command to the server and wait for a response. Return response as a
  // promise.
  this.sendCommand = (command) => {
    let ondata = '';
    let onerror ='';

    return new Promise((resolve, reject) => {
      let received = '';

      const timeout = setTimeout(() => {
        let errorMessage = `Command <${JSON.stringify(command)}> did not receive a response in ${TIMEOUT/1000}'s.`;
        if (received) {
          errorMessage += ` Received messages so far: ${received}`;
        }
        reject(errorMessage);
      }, TIMEOUT);

      ondata = (data) => {
        received += data.toString();
        const index = received.indexOf('\r\n');
        if (index !== -1) {
          clearTimeout(timeout);
          const response = received.substring(0, index).trim();
          resolve(response);
        }
      };
      socket.on('data', ondata);

      onerror = (data) => {
        reject(`Received error: ${data}`);
      };
      socket.on('error', onerror);

      socket.write(`${command}\r\n`);
    })
      .finally(() => {
        socket.removeListener('data', ondata);
        socket.removeListener('error', onerror);
      });
  };
};

/**
 * Util for running an interactive Protractor test.
 */
exports.InteractiveTest = function(command, port) {
  let expectations = [];

  // Adds a command to send as well as the response to verify against.
  // If opt_expectedResult is undefined, the test will still wait for the server
  // to respond after sending the command, but will not verify against it.
  // Note, this does not actually interact with the server, but simply adds the
  // command to a queue.
  this.addCommandExpectation = (command, opt_expectedResult) => {
    expectations.push({
      command: command,
      expectedResult: opt_expectedResult
    });
  };

  // Execute the interactive test. This will first start Protractor and its
  // debugger server. Then it will connect to the server. Finally, it will
  // send the queue of commands against the server sequentially and verify the
  // response from the server if needed.
  this.run = async () => {
    const server = new Server(command, port);
    await server.start();
    const client = new Client(port);
    await client.connect();
    const verifyAll = async (index) => {
      if (index < expectations.length) {
        const expectedResult = expectations[index].expectedResult;
        const command = expectations[index].command;
        const response = await client.sendCommand(command);
        if (expectedResult !== undefined && expectedResult !== response) {
          throw new Error(
            `Command <${JSON.stringify(command)}> received: ${response}', but expects: ${expectedResult}`
          );
        } else {
          await verifyAll(index + 1);
        }
      }
    };
    await verifyAll(0);

    // '^]' This is the term signal.
    await client.sendCommand(String.fromCharCode(0x1D));
    client.disconnect();
  };
};