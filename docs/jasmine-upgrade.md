## Upgrading from Jasmine 1.3 to 2.0

First, please read [Jasmine's official upgrade documentation](http://jasmine.github.io/2.0/upgrading.html).

### In your conf file

Specify that you want to use jasmine2.0:

```javascript
exports.config = {
  // Specify you want to use jasmine 2.0 as you would with mocha and cucumber.
  framework: 'jasmine2'
};

```

### In your specs

#### Focused specs

Instead of `iit`, please use `fit`. Instead of `ddescribe`, please use `fdescribe`.

#### Custom matchers

See http://jasmine.github.io/2.0/upgrading.html#section-Custom_Matchers

Before:
```javascript
toHaveText: function(expectedText) {
  return this.actual.getText().then(function(actualText) {
    return expectedText === actualText;
  });
}
```

Now:
```javascript
toHaveText: function() {
  return {
    compare: function(actual, expectedText) {
      return {
        pass: actual.getText().then(function(actualText) {
          return actualText === expectedText;
        })
      };
    }
  };
}
```

#### Asynchronous specs

Note: `minijasminenode` provided asynchronous support for jasmine1.3 before (i.e. via done callback). Jasmine 2.0 now provides the support natively, but the change is mostly transparent to protractor users who are upgrading from jasmine1.3.

You can still pass in the done parameter as part of your asynchronous spec, but the syntax for failing it has changed.

Before:
```javascript
it('async spec', function(done) {
  setTimeout(function() {
    if (passed) {
      done(); // When done
    } else {
      done('failure message'); // To fail spec
    }
  }, 5000);
});
```

Now:
```javascript
it('async spec', function(done) {
  setTimeout(function() {
    if (passed) {
      done(); // When done
    } else {
      done.fail('failure message'); // To fail spec
    }
  }, 5000);
});
```
