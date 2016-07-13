`async`/`await` in Protractor
=============================

`async`/`await` is a feature that may or may not be added to javascript in
the future.  It is currently accessible via typescript if you compile using
`tsc -t ES2015 <files>`.  Protractor supports returning a promise at the end of
an `it()` block, so it indirectly supports `async`/`await` (so long as your
programming environment supports it).
