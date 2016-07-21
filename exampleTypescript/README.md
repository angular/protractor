# Protractor with Typescript

Typescript provides code auto completion and helpful hints with a text editor like Microsoft's Visual Studio Code or another text editor with Typescript support.

## Examples

There are two examples in this directory:

* Simple Protractor example
  * Similar to the [github protractor example](https://github.com/angular/protractor/tree/master/example)
  * Files `conf.ts` and `spec.ts`
* Page objects example
  * Follows the [protractortest.org page objects example](http://www.protractortest.org/#/page-objects)
  * Files `confPageObjects.ts`, `specPageObjects.ts`, and `angularPage.ts`

## File organization

```
exampleTypescript/
|- node_modules/       // downloaded node modules
|- typings/            // downloaded ambient types
|   |- index.d.ts      // generated typings file
|- .gitignore          // since typescript produces javascript, we should not
|                      // commit javascript to the repo
|- angularPage.ts      // page object example
|- confPageObjects.ts  // configuration for the page objects example
|- package.json        // node dependencies for the project
|- readme.md           // this file
|- spec.ts             // spec for the simple protractor example
|- specPageObjects.ts  // spec for the page objects example
|- tsconfig.json       // typescript transpile configuration
|- typings.json        // ambient typing imports (jasmine, node, etc)
```


## Getting started

This package.json references the local protractor directory with `"protractor": "file: ../"`. For the type declarations to work, from the protractor directory run an `npm install` to generate the declarations file.

Next, install the exampleTypescript node_modules and ambient typings with:

```
npm install
```

The ambient typings are downloaded from DefinitelyTyped in the `postinstall` step. The files that are downloaded are listed in the `typings.json` file.


## Protractor typings

To use Protractor types, you'll need to import `protractor/globals`. After this is imported, you should have autocompletion hints when typing.

```
import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';
```

Although the Protractor configuration file can be written in javascript, creating it in typescript will have some hints. These hints and the reference configuration can be found in `lib/config.ts`. Below we are importing the Config interface and applying that interface to the config variable:

```
import {Config} from 'protractor';

export let config: Config = {
  ...
}
```

## Ambient typings

Protractor also uses ambient types including jasmine and node. These are brought in via the `typings.json` file. The ambient typings files are imported from the `typings/index.d.ts` generated file and are included in the project via the `tsconfig.json` configuration file.


## Compiling your code

To convert your typescript to javascript (transpiling), you'll use the Typescript compiler (tsc). If you install typescript globally, the command is `tsc`. If it is not installed globally, the typescript compiler can be executed with `npm run tsc`.

## Running Protractor

After transpiling your code to javascript, you'll run Protractor like before: `protractor conf.js`

## Helpful links

* [TypescriptLang.org tutorial](http://www.typescriptlang.org/docs/tutorial.html)
* [TypescriptLang.org tsconfig.json](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
* [Typescript gitter](https://gitter.im/Microsoft/TypeScript)
* [Typescript stackoverflow](http://stackoverflow.com/questions/tagged/typescript)
