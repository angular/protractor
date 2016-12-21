import {ChildProcess, fork} from 'child_process';
import * as q from 'q';

import {Config} from './config';
import {Logger} from './logger';

const BP_PATH = require.resolve('blocking-proxy/built/lib/bin.js');

let logger = new Logger('BlockingProxy');

export class BlockingProxyRunner {
  bpProcess: ChildProcess;
  public port: number;

  constructor(private config: Config) {}

  start() {
    return q.Promise((resolve, reject) => {
      this.checkSupportedConfig();

      let args = [
        '--fork', '--seleniumAddress', this.config.seleniumAddress, '--rootElement',
        this.config.rootElement
      ];
      this.bpProcess = fork(BP_PATH, args, {silent: true});
      logger.info('Starting BlockingProxy with args: ' + args.toString());
      this.bpProcess
          .on('message',
              (data) => {
                this.port = data['port'];
                resolve(data['port']);
              })
          .on('error',
              (err) => {
                reject(new Error('Unable to start BlockingProxy ' + err));
              })
          .on('exit', (code: number, signal: number) => {
            reject(new Error('BP exited with ' + code));
            logger.error('Exited with ' + code);
            logger.error('signal ' + signal);
          });

      this.bpProcess.stdout.on('data', (msg: Buffer) => {
        logger.debug(msg.toString().trim());
      });

      this.bpProcess.stderr.on('data', (msg: Buffer) => {
        logger.error(msg.toString().trim());
      });

      process.on('exit', () => {
        this.bpProcess.kill();
      });
    });
  }

  checkSupportedConfig() {
    if (this.config.directConnect) {
      throw new Error('BlockingProxy not yet supported with directConnect!');
    }
  }
}
