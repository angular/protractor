import {promise, WebElement} from 'selenium-webdriver';

import {ProtractorBrowser} from '../../browser';
import {Locator} from '../../locators';
let absoluteXPath = require('./explorerXpath').absoluteXPath;

export class ExplorerScripts {
  static list(locator: Locator) {
    (<any>global).tempRootEl = (<any>global).browser.rootEl;
    return (<any>global)
        .browser.findElements(locator)
        .then((arr: WebElement[]) => {
          let found: string[] = [];
          for (let i = 0; i < arr.length; ++i) {
            arr[i].getText().then((text: string) => { found.push(text); });
          }
          return found;
        })
        .catch((err: Error) => { throw err; });
  }

  static highlight(locator: Locator) {
    let xPaths: string[] = [];
    let cssBorders: string[] = [];

    return (<any>global)
        .browser.findElements(locator)
        .then((arr: WebElement[]) => {

          for (let i = 0; i < arr.length; ++i) {
            ExplorerScripts.getAbsoluteXPath(arr[i]).then(
                (result: string) => { xPaths.push(result); });
            (arr[i] as any).getCssValue('border').then((val: string) => {
              cssBorders.push(val);
            });
          }
          if (arr.length == 0) {
            return 'No elements found.';
          }

        })
        .then(() => {

          let timesFlashed = 10;
          let waitTime = 500;
          for (let t = 0; t < timesFlashed; t++) {
            let borderValue = '5px dotted rgb(255, 55, 55)';
            if (t % 2 == 1) {
              borderValue = '5px dotted rgb(255, 180, 55)';
            }
            for (let i = 0; i < xPaths.length; i++) {
              (<any>global)
                  .browser.executeScript(
                      'var x = document.evaluate(\'' + xPaths[i] +
                      '\', document, null, XPathResult.ANY_TYPE, null);' +
                      'var xx = x.iterateNext(); xx.style.border = \'' +
                      borderValue + '\';');
            }

            global.browser.driver.sleep(waitTime);
          }

        })
        .then(() => {

          for (let j = 0; j < cssBorders.length; j++) {
            (<any>global)
                .browser.executeScript(
                    'var x = document.evaluate(\'' + xPaths[j] +
                    '\', document, null, XPathResult.ANY_TYPE, null);' +
                    'var xx = x.iterateNext(); xx.style.border = \'' +
                    cssBorders[j] + '\';');
          }
          return 'Highlighting Completed.';

        });
  };


  static getAbsoluteXPath(element: WebElement): promise.Promise<any> {
    return (<any>global)
        .browser.executeScript(
            'var absoluteXPath = ' +
                Function.prototype.toString.call(absoluteXPath) +
                ';\nreturn absoluteXPath(arguments[0]);',
            element);
  };
}
