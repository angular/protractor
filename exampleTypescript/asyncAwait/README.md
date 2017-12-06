Compiling `async`/`await` syntax
================================

`async`/`await` syntax is currently accessible via typescript if you compile
using `--target ES2015` or above.

Debugging with `async`/`await`
==============================

Disabling the promise manager will break Protractor's debugging and
`browser.pause()`. However, because your tests won't be using the promise
manager, you can debug them using standard Node debugging tools. For
example, you can use the Chrome inspector to debug the test in this
directory (protractor/exampleTypescript) with `npm run debug`. You should see something like

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

More detail about how to use [chrome
    inspector](/docs/debugging.md#disabled-control-flow)

More Examples
=============

More examples can be found under [`/spec/ts/`](/spec/ts).
