const child_process = require('child_process');
const net = require('net');

const TIMEOUT = 10000;

// An instance of a protractor debugger server.
class Server {
  constructor(command, port) {
    this.command = command;
    this.port = port;
  }
  // Start protractor and its debugger server as a child process.
  start() {
    return new Promise((resolve, reject) => {
      let received = '';

      const commands = `${this.command} --debuggerServerPort ${this.port}`.split(/\s/);
      const command = commands[0];
      const args = commands.slice(1);
      const test_process = child_process.spawn(command, args);

      const timeout = setTimeout(() => {
        let errorMessage = `Did not start interactive server in ${TIMEOUT/1000}s.`;
        if (received) {
          errorMessage += ` Server startup output: ${received}`;
        }
        reject(errorMessage);
      }, TIMEOUT);

      test_process.stdout.on('data', (data) => {
        received += data;
        if (received.indexOf(`Server listening on 127.0.0.1:${this.port}`) !== -1) {
          clearTimeout(timeout);
          // Add a small time for browser to get ready
          setTimeout(resolve(), 2000);
        }
      });

      test_process.stderr.on('data', (data) => {
        received += data;
      });
    });
  }
}

// A client to attach to Protractor's debugger server and exchange data.
class Client {
  constructor(port) {
    this.port = port;
    this.socket = undefined;
  }

  // Connect to the server.
  connect() {
    return new Promise(resolve => {
      this.socket = net.connect({port: this.port}, () => {
        resolve();
      });
    });
  }

  // Disconnect from the server.
  disconnect() {
    this.socket.end();
  }

  // Send a command to the server and wait for a response. Return response as a
  // promise.
  sendCommand(command) {
    let timeout;
    let ondata;
    let onerror;

    return new Promise((resolve, reject) => {
      let received = '';
      timeout = setTimeout(() => {
        let errorMessage = `Command ${JSON.stringify(command)} did not receive a response in ${TIMEOUT/1000}s.`;
        if (received) {
          errorMessage += ` Received messages so far: ${received}`;
        }
        reject(errorMessage);
      }, TIMEOUT);

      ondata = (data) => {
        received += data.toString();
        let i = received.indexOf('\r\n');
        if (i !== -1) {
          clearTimeout(timeout);
          const response = received.substring(0, i).trim();
          resolve(response);
        }
      };
      this.socket.on('data', ondata);

      onerror = (data) => {
        reject(`Received error: ${data}`);
      };
      this.socket.on('error', onerror);

      this.socket.write(`${command}\r\n`);
    }).finally(() => {
      clearTimeout(timeout);
      this.socket.removeListener('data', ondata);
      this.socket.removeListener('error', onerror);
    });
  }
}

/**
 * Util for running an interactive Protractor test.
 */
module.exports = class InteractiveTest {
  constructor(command, port) {
    this.command = command;
    this.port = port;
    this.expectations = [];
  }

  // Adds a command to send as well as the response to verify against.
  // If opt_expectedResult is undefined, the test will still wait for the server
  // to respond after sending the command, but will not verify against it.
  // Note, this does not actually interact with the server, but simply adds the
  // command to a queue.
  addCommandExpectation(command, opt_expectedResult) {
    this.expectations.push({
      command: command,
      expectedResult: opt_expectedResult
    });
  }

  // Execute the interactive test. This will first start Protractor and its
  // debugger server. Then it will connect to the server. Finally, it will
  // send the queue of commands against the server sequentially and verify the
  // response from the server if needed.
  async run() {
    let failed = false;
    let successfulCommands = [];
    let failedCommands = [];

    const server = new Server(this.command, this.port);
    await server.start();
    const client = new Client(this.port);
    await client.connect();
    for (let expectation of this.expectations) {
      const expectedResult = expectation.expectedResult;
      const command = expectation.command;
      const response = await client.sendCommand(command);
      if (expectedResult !== undefined && expectedResult !== response) {
        failed = true;
        successfulCommands.push(
          `Command ${JSON.stringify(command)} received: ${response}, but expects: ${expectedResult}\n`
        );
      } else {
        failedCommands.push('Command response as expected\n');
      }
    }
    console.log('Successful commands: ');
    for (let command of successfulCommands) {
      console.log(command);
    }
    console.log('Failed commands: ');
    for (let command of failedCommands) {
      console.log(command);
    }
    console.log('Summary: ' + (failed ? 'fail' : 'pass'));
    await client.sendCommand(String.fromCharCode(0x1D));
    await client.disconnect();
  }
};
