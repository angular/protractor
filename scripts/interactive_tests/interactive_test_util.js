const child_process = require('child_process');
const net = require('net');

const TIMEOUT = 10000;

// An instance of a protractor debugger server.
const Server = function(serverStartCmd, port) {
  // Start protractor and its debugger server as a child process.
  this.start = async () => {
    return await new Promise((resolve, reject) => {
      let received = '';
      const serverStart = (`${serverStartCmd} --debuggerServerPort ${port}`)
        .split(/\s/);
      const test_process = child_process.spawn(serverStart[0], serverStart.slice(1));

      const timeoutObj = setTimeout(() => {
        let errMsg = 'Did not start interactive server in ' + TIMEOUT/1000 + 's.';
        if (received) {
          errMsg += ` Server startup output: ' + ${received}`;
        }
        reject(errMsg);
      }, TIMEOUT);

      test_process.stdout.on('data', (data) => {
        received += data;
        if (received.indexOf(`Server listening on 127.0.0.1:${port}`) !== -1) {
          clearTimeout(timeoutObj);
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

  // Connect to the server.
  this.connect = async () => {
    return await new Promise(resolve => {
      socket = net.connect({port: port}, () => {
        resolve();
      });
    });
  };

  // Disconnect from the server.
  this.disconnect = function() {
    socket.end();
  };

  // Send a command to the server and wait for a response. Return response as a
  // promise.
  this.sendCommand = async (cmd) => {
    await new Promise((resolve, reject) => {
      let received = '';
      const timeoutObj = setTimeout(() => {
        let errMsg = `Command <${JSON.stringify(cmd)}> did not receive a response in ${TIMEOUT/1000}'s.`;
        if (received) {
          errMsg += ` Received messages so far: ${received}`;
        }
        reject(errMsg);
      }, TIMEOUT);

      const ondata = (data) => {
        received += data.toString();
        const i = received.indexOf('\r\n');
        if (i !== -1) {
          clearTimeout(timeoutObj);
          const response = received.substring(0, i).trim();
          resolve(response);
        }
      };
      socket.on('data', ondata);

      const onerror = (data) => {
        reject(`Received error: ${data}`);
      };
      socket.on('error', onerror);

      socket.write(cmd + '\r\n');
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
exports.InteractiveTest = function(interactiveServerStartCmd, port) {
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
    const server = new Server(interactiveServerStartCmd, port);
    await server.start();
    const client = new Client(port);
    await client.connect();
    const verifyAll = async (i) => {
      if (i < expectations.length) {
        const expectedResult = expectations[i].expectedResult;
        const command = expectations[i].command;
        const response = await client.sendCommand(command);
        if (expectedResult !== undefined && expectedResult !== response) {
          throw new Error(
            `Command <${JSON.stringify(command)}> received: ${response}', but expects: ${expectedResult}`
          );
        } else {
          await verifyAll(i + 1);
        }
      }
    };
    await verifyAll(0);

    // '^]' This is the term signal.
    await client.sendCommand(String.fromCharCode(0x1D));
    await client.disconnect();
  };
};