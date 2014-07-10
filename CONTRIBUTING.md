Contributing
============

Questions
---------

Please ask questions on [StackOverflow](http://stackoverflow.com/questions/tagged/protractor),
and read through the [FAQ](https://github.com/angular/protractor/blob/master/docs/faq.md)
and issue archives.


Issues
------

If you have a bug or feature request, please file an issue.
Before submitting an issue, please search the issue archive to help reduce duplicates, and read the
[FAQ](https://github.com/angular/protractor/blob/master/docs/faq.md).

When submitting an issue, please include context from your test and
your application. If there's an error, please include the error text.

Please format code and markup in your issue using [github markdown](https://help.github.com/articles/github-flavored-markdown).


Contributing to Source Code (Pull Requests)
===========================================

Loosely, follow the [Angular contribution rules](http://docs.angularjs.org/misc/contribute).

Protractor specific rules
-------------------------

 * JavaScript style should generally follow the [Google JS style guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).
 * Wrap code at 80 chars.
 * Document public methods with jsdoc.
 * Be consistent with the code around you!

Commit Messages
---------------

Protractor follows AngularJS's [commit message format](https://docs.google.com/a/google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.z8a3t6ehl060).

In summary, this style is

    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>

Where `<type>` is one of [feat, fix, docs, style, refactor, test, chore] and
`<scope>` is a quick descriptor of the location of the change, such as cli, clientSideScripts, element.

Testing your changes
--------------------

Test your changes on your machine by running `npm start` to start up the test application,
then `npm test` to run the test suite. This assumes you have a Selenium Server running
at localhost:4444.

When you submit a PR, tests will also be run on the Continuous Integration environment
through Travis. If your tests fail on Travis, take a look at the logs - if the failures
are known flakes in Internet Explorer or Safari you can ignore them, but otherwise
Travis should pass.
