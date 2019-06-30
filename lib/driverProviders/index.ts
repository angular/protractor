export * from './attachSession';
export * from './browserStack';
export * from './direct';
export * from './driverProvider';
export * from './hosted';
export * from './local';
export * from './mock';
export * from './sauce';
export * from './testObject';
export * from './kobiton';


import {AttachSession} from './attachSession';
import {BrowserStack} from './browserStack';
import {DriverProvider} from './driverProvider';
import {Direct} from './direct';
import {Hosted} from './hosted';
import {Local} from './local';
import {Mock} from './mock';
import {Sauce} from './sauce';
import {TestObject} from './testObject';
import {Kobiton} from './kobiton';

import {Config} from '../config';
import {Logger} from '../logger';

let logger = new Logger('driverProviders');

export let buildDriverProvider = (config: Config): DriverProvider => {
  let driverProvider: DriverProvider;

  if (config.directConnect) {
    driverProvider = new Direct(config);
    logWarnings('directConnect', config);
  } else if (config.seleniumAddress) {
    if (config.seleniumSessionId) {
      driverProvider = new AttachSession(config);
      logWarnings('attachSession', config);
    } else {
      driverProvider = new Hosted(config);
      logWarnings('hosted', config);
    }
  } else if (config.testobjectUser && config.testobjectKey) {
    driverProvider = new TestObject(config);
    logWarnings('testObject', config);
  } else if (config.kobitonUser && config.kobitonKey) {
    driverProvider = new Kobiton(config);
    logWarnings('kobiton', config);
  } else if (config.browserstackUser && config.browserstackKey) {
    driverProvider = new BrowserStack(config);
    logWarnings('browserStack', config);
  } else if (config.sauceUser && config.sauceKey) {
    driverProvider = new Sauce(config);
    logWarnings('sauce', config);
  } else if (config.seleniumServerJar) {
    driverProvider = new Local(config);
    logWarnings('local', config);
  } else if (config.mockSelenium) {
    driverProvider = new Mock(config);
    logWarnings('mock', config);
  } else {
    driverProvider = new Local(config);
    logWarnings('local', config);
  }
  return driverProvider;
};

export let logWarnings = (providerType: string, config: Config): void => {

  let warnInto = 'Using driver provider ' + providerType +
      ', but also found extra driver provider parameter(s): ';
  let warnList: string[] = [];
  if ('directConnect' !== providerType && config.directConnect) {
    warnList.push('directConnect');
  }
  if ('attachSession' !== providerType && 'hosted' !== providerType && config.seleniumAddress) {
    warnList.push('seleniumAddress');
  }
  if ('attachSession' !== providerType && config.seleniumSessionId) {
    warnList.push('seleniumSessionId');
  }
  if ('testObject' !== providerType && config.testObjectUser) {
    warnList.push('testobjectUser');
  }
  if ('testObject' !== providerType && config.testObjectKey) {
    warnList.push('testobjectKey');
  }
  if ('kobitonUser' !== providerType && config.kobitonUser) {
    warnList.push('kobitonUser');
  }
  if ('kobitonKey' !== providerType && config.kobitonKey) {
    warnList.push('kobitonKey');
  }
  if ('browserStack' !== providerType && config.browserstackUser) {
    warnList.push('browserstackUser');
  }
  if ('browserStack' !== providerType && config.browserstackKey) {
    warnList.push('browserstackKey');
  }
  if ('sauce' !== providerType && config.sauceUser) {
    warnList.push('sauceUser');
  }
  if ('sauce' !== providerType && config.sauceKey) {
    warnList.push('sauceKey');
  }
  if ('local' !== providerType && config.seleniumServerJar) {
    warnList.push('seleniumServerJar');
  }
  if ('mock' !== providerType && config.mockSelenium) {
    warnList.push('mockSelenium');
  }
  if (warnList.length !== 0) {
    logger.warn(warnInto + warnList.join(', '));
  }
};
