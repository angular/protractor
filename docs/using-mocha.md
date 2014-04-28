Using Mocha
===========

_Please note that Mocha support is new as of December 2013 and may still have some rough edges._

If you would like to use mocha instead of Jasmine as your test framework, you'll need a little extra setup. Mocha has limited support - you'll need to use the BDD interface and chai assertions with [Chai As Promised](http://chaijs.com/plugins/chai-as-promised).

Download the dependencies with npm. Mocha should be installed in the same place as Protractor - so if protractor was installed globally, install Mocha with -g.

    npm install -g mocha
    npm install chai
    npm install chai-as-promised

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

Finally, set the 'framework' property of the config to 'mocha', either by adding [`framework: 'mocha'`](https://github.com/angular/protractor/blob/master/spec/mochaConf.js#L5) to the config file or adding `--framework=mocha` to the command line.

Options for mocha such as 'reporter', 'slow', can be given in config file with `mochaOpts` :

```javascript
mochaOpts: {
  reporter: "spec",
  slow: 3000
}
```

See a full [example in protractor's own tests](https://github.com/angular/protractor/tree/master/spec/mocha).
