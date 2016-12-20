import {ActionSequence, Browser, Builder, Button, Capabilities, Capability, Command, CommandName, error, EventEmitter, FileDetector, Key, logging, promise, Session, until, WebDriver, WebElement, WebElementPromise} from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/firefox';
import * as http from 'selenium-webdriver/http';
import * as remote from 'selenium-webdriver/remote';

import {ElementHelper, ProtractorBrowser} from './browser';
import {ElementArrayFinder, ElementFinder} from './element';
import {ProtractorExpectedConditions} from './expectedConditions';
import {ProtractorBy} from './locators';

let webdriver = require('selenium-webdriver');

export class Ptor {
  // Variables tied to the global namespace.
  browser: ProtractorBrowser;
  $ = function(search: string): ElementFinder {
    return null;
  };
  $$ = function(search: string): ElementArrayFinder {
    return null;
  };
  element: ElementHelper;
  By: ProtractorBy;
  by: ProtractorBy;
  wrapDriver:
      (webdriver: WebDriver, baseUrl?: string, rootElement?: string,
       untrackOutstandingTimeouts?: boolean) => ProtractorBrowser;
  ExpectedConditions: ProtractorExpectedConditions;

  // Export protractor classes.
  ProtractorBrowser = require('./browser').ProtractorBrowser;
  ElementFinder = require('./element').ElementFinder;
  ElementArrayFinder = require('./element').ElementArrayFinder;
  ProtractorBy = require('./locators').ProtractorBy;
  ProtractorExpectedConditions = require('./expectedConditions').ProtractorExpectedConditions;

  // Export selenium webdriver.
  ActionSequence = webdriver.ActionSequence;
  Browser = webdriver.Browser;
  Builder = webdriver.Builder;
  Button = webdriver.Button;
  Capabilities = webdriver.Capabilities;
  Capability = webdriver.Capability;
  EventEmitter = webdriver.EventEmitter;
  FileDetector = webdriver.FileDetector;
  Key = webdriver.Key;
  Session = webdriver.Session;
  WebDriver = webdriver.WebDriver;
  WebElement = webdriver.WebElement;
  WebElementPromise = webdriver.WebElementPromise;
  error = webdriver.error;
  logging = webdriver.logging;
  promise = webdriver.promise;
  until = webdriver.until;
  Command = require('selenium-webdriver/lib/command').Command;
  CommandName = require('selenium-webdriver/lib/command').Name;
  utils = {
    firefox: require('selenium-webdriver/firefox'),
    http: require('selenium-webdriver/http'),
    remote: require('selenium-webdriver/remote')
  };
}

export let protractor = new Ptor();
