Contributing
============

Questions
---------

Please first read through the [FAQ](https://github.com/angular/protractor/blob/master/docs/faq.md).

Please ask questions on [StackOverflow](http://stackoverflow.com/questions/tagged/protractor), [Google Group discussion list](https://groups.google.com/forum/?fromgroups#!forum/angular), or [Gitter](https://gitter.im/angular/protractor).

Any questions posted to Protractor's Github Issues will be closed with this note:

Please direct general support questions like this one to an appropriate support channel, see https://github.com/angular/protractor/blob/master/CONTRIBUTING.md#questions

Thank you!


Issues
======

If you have a bug or feature request, please file an issue.
Before submitting an issue, please search the issue archive to help reduce duplicates, and read the
[FAQ](https://github.com/angular/protractor/blob/master/docs/faq.md).

Try running with troubleshooting messages (`protractor --troubleshoot`) against your configuration to make sure that there is not an error with your setup.

When submitting an issue, please include a reproducible case that we can actually run. Protractor has a test Angular application available at `http://www.protractortest.org/testapp` which you can use for the reproducible test case. If there's an error, please include the error text.

Please format code and markup in your issue using [github markdown](https://help.github.com/articles/github-flavored-markdown).


Contributing to Source Code (Pull Requests)
===========================================

Loosely, follow the [Angular contribution rules](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md).

 * If your PR changes any behavior or fixes an issue, it should have an associated test.
 * New features should be general and as simple as possible.
 * Breaking changes should be avoided if possible.
 * All pull requests require review. No PR will be merged without a comment from a team member stating LGTM (Looks good to me).

Protractor specific rules
-------------------------

 * JavaScript style should generally follow the [Google JS style guide](https://google.github.io/styleguide/javascriptguide.xml).
 * Wrap code at 80 chars.
 * Document public methods with jsdoc.
 * Be consistent with the code around you!

Commit Messages
---------------

Please write meaningful commit messages - they are used to generate the changelog, so the commit message should tell a user everything they need to know about a commit. Protractor follows AngularJS's [commit message format](https://docs.google.com/a/google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.z8a3t6ehl060).

In summary, this style is

    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>

Where `<type>` is one of [feat, fix, docs, refactor, test, chore, deps] and
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
