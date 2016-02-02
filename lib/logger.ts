import {Config} from './configParser';

/**
 * Utility functions for command line output logging from Protractor.
 * May be used in different processes, since the launcher spawns
 * child processes for each runner.
 *
 * All logging directly from Protractor, its driver providers, or runners,
 * should go through this file so that it can be customized.
 */

let troubleshoot: boolean = false;

export function set(config: Config): void {
  troubleshoot = config.troubleshoot;
}

export function print(msg: string): void {
  process.stdout.write(msg);
}

export function puts(...args: Array<any>): void {
  console.log.apply(console, args);
}

export function debug(msg: string): void {
  if (troubleshoot) {
    console.log('DEBUG - ' + msg);
  }
}

export function warn(msg: string): void {
  puts('WARNING - ' + msg);
}

export function error(msg: string): void {
  puts('ERROR - ' + msg);
}
