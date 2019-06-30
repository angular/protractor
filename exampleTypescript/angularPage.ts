// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor';
//
import {browser, element, by} from 'protractor';

export class AngularHomepage {
  nameInput = element(by.model('yourName'));
  greeting = element(by.binding('yourName'));

  async get(): Promise<void> {
    await browser.get('http://www.angularjs.org');
  }

  async setName(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  // getGreeting returns a native Promise<string>
  async getGreeting(): Promise<string> {
    return this.greeting.getText();
  }
}
