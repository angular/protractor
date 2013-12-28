Using Mocha
===========

_Please note that Mocha support is new as of December 2013 and may still have some rough edges._

Mocha support is only available on Protractor's canary version at the moment. Install with

    npm install -g protractor@canary

If you would like to use mocha instead of Jasmine as your test framework, you'll need a little extra setup. Mocha has limited support - you'll need to use the BDD interface and chai assertions with [Chai As Promised](http://chaijs.com/plugins/chai-as-promised).

Download the dependencies with npm. This should be in the same place as protractor is installed (so if you installed protracted with -g, you should use -g here).

    npm install -g mocha
    npm install -g chai
    npm install -g chai-as-promised

You will need to require and set up chai inside your test files:

```javascript
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;
```

You can then use Chai As Promised as such

```javascript
expect(myElement.getText()).to.eventually.equal('some text');
```

Finally, set the 'framework' property of the config to 'mocha', either by adding `framework: mocha` to the config file or adding `--framework=mocha` to the command line.

See a full [example in protractor's own tests](https://github.com/angular/protractor/tree/master/spec/mocha).
