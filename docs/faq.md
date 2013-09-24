FAQ
===

_My tests time out in Protractor, but everything's working fine when running
manually. What's up?_

Protractor attempts to wait until the page is completely loaded before
performing any action (such as finding an element or sending a command to
an element). If your application continuously polls $timeout or $http, it will
never be registered as completely loaded. Discussion of this is in [issue 59](https://github.com/angular/protractor/issues/49).


_How do I deal with my log-in page?_

If your app needs log-in, there are a couple ways to deal with it. If your login
page is not written with Angular, you'll need to interact with it via 
unwrapped webdriver, which can be accessed like `ptor.driver.get()`. 

You can put your log-in code into an `onPrepare` function, which will be run
once before any of your tests. See [this example](https://github.com/angular/protractor/blob/master/spec/login/viaConfigConf.js).

If you would like to do your login in your test suite itself, see
[this example](https://github.com/angular/protractor/blob/master/spec/login/viaTestSpec.js).
