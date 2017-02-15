`async`/`await` and the Web Driver Control Flow
===============================================

The Web Driver Control Flow is used to synchronize your commands so they reach
the browser in the correct order (see
[/docs/control-flow.md](/docs/control-flow.md) for details).  In the future, the
control flow is being removed (see [SeleniumHQ's github issue](
https://github.com/SeleniumHQ/selenium/issues/2969) for details). Instead of the
control flow, you can synchronize your commands with promise chaining or the
upcoming ES7 feature `async`/`await`.

However, you cannot use a mix of `async`/`await` and the control flow:
`async`/`await` causes the control flow to become unreliable (see
[github issue]( https://github.com/SeleniumHQ/selenium/issues/3037)).  So if you
`async`/`await` anywhere in a spec, you should use the
`SELENIUM_PROMISE_MANAGER: false` [config option](/lib/config.ts#L644).

Compiling `async`/`await` syntax
================================

`async`/`await` syntax is currently accessible via typescript if you compile
using `--target ES2015` or above.  You can also compile it using [regenerator](
  https://github.com/facebook/regenerator).


More Examples
=============

More examples can be found under [`/spec/ts/`](/../../spec/ts).
