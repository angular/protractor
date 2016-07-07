// Because this file imports from  protractor, you'll need to have it as a
// project dependency. Please see the reference config: lib/config.ts for more
// information.
//
// Why you might want to create your config with typescript:
// edtiors like Microsoft Visual Studio Code will have autocomplete and
// description hints.
//
// To run this example, run 'npm run tsc' to transpile the typescript to
// javascript. run with 'protractor conf_withPageObjects.js'
import {Config} from 'protractor';

export let config: Config  = {
  framework: 'jasmine',
  capabilities: {
    browserName: 'chrome'
  },
  specs: [ 'specPageObjects.js' ],
  seleniumAddress: 'http://localhost:4444/wd/hub'
};
