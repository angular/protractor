// Because this file imports from  protractor, you'll need to have it as a
// project dependency.
//
// To run this example, run 'npm run tsc -t ES2015' to transpile the typescript
// to javascript. run with 'protractor conf.js'
import {Config} from 'protractor';

export let config: Config  = {
  framework: 'jasmine',
  capabilities: {
    browserName: 'chrome'
  },
  specs: [ 'spec.js' ],
  seleniumAddress: 'http://localhost:4444/wd/hub'
};
