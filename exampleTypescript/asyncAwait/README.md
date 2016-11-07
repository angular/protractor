`async`/`await` and the Web Driver Control Flow
===============================================

The Web Driver Control Flow is used to synchronize your commands so they reach
the browser in the correct order (see [control-flow.md](
../../docs/control-flow.md) for details).  In the future, the control flow is
being removed, however (see [github issue](
https://github.com/SeleniumHQ/selenium/issues/2969) for details).  Instead of
the control flow, you can synchronize your commands with promise chaining or the
upcomming ES7 feature `async`/`await`.  However, you cannot use a mix of
`async`/`await` and the control flow: `async`/`await` causes the control flow to
become unreliable (see [github issue](
https://github.com/SeleniumHQ/selenium/issues/3037)).  So if you `async`/`await`
anywhere in a spec, you should use `await` or promise chaining to handle all
asynchronous activity (e.g. any command interacting with the browser) for the
rest of that test.

In the near future there will be an option to disable the Web Driver control
flow entierly (see https://github.com/angular/protractor/issues/3691).  If you
are using `async`/`await`, it is highly recommended that you disable the Web
Driver control flow. 


Compiling `async`/`await` syntax
================================

`async`/`await` syntax is currently accessible via typescript if you compile
using `tsc -t ES2015 <files>`.  You can also compile it using [regenerator](
  https://github.com/facebook/regenerator).
