FAQ
===

_My tests time out in Protractor, but everything's working fine when running
manually. What's up?_

Protractor attempts to wait until the page is completely loaded before
performing any action (such as finding an element or sending a command to
an element). If your application continuously polls $timeout or $http, it will
never be registered as completely loaded. Discussion of this is in [issue 59](https://github.com/angular/protractor/issues/49).
