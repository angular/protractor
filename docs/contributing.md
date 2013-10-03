Contributing to Source Code
===========================

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
`<scope>` is a quick descriptor of the location of the change, such as cli,
jasminewd, clientSideScripts, findElements.
