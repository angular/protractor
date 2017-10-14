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
`SELENIUM_PROMISE_MANAGER: false` [config option](/lib/config.js#L644).

Compiling `async`/`await` syntax
================================

`async`/`await` syntax is currently accessible via typescript if you compile
using `--target ES2015` or above. This example 

Debugging with `async`/`await`
==============================

Disabling the promise manager will break Protractor's debugging and
`browser.pause()`. However, because your tests won't be using the promise 
manager, you can debug them using standard Node debugging tools. For
example, you can use the Chrome inspector to debug the test in this 
directory with `npm run debug`. You should see something like

```
Debugger listening on port 9229.
Warning: This is an experimental feature and could change at any time.
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/f48502b0-76a3-4659-92d1-bef07a222859
```

Open that URL in chrome, and you'll get an inspector that can be
used to debug your test. Instead of browser.pause, you can add `debugger` 
to create a breakpoint.  Note that sourcemaps don't work in the inspector 
in Node v6, but do work in Node v7 (due to https://github.com/nodejs/node/issues/8369).

More Examples
=============

More examples can be found under [`/spec/ts/`](/spec/ts).
