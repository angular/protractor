//  a plugin example with the protractor plugin interface
import { ProtractorPlugin } from 'protractor';

// creating a "var module: any" will allow use of module.exports
declare var module: any;

let myPlugin: ProtractorPlugin = {
  addSuccess(info: {specName: string}) {
    console.log('on success: ' + info.specName);
  },
  onPageLoad() {
    this.addSuccess({specName: 'Hello, World!'});
  }
};

module.exports = myPlugin;
