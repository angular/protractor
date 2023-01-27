Protractor website
==================

Generates the documentation for the protractor website.

## How to run

From the root of the project, on a fresh clone: 
```shell
npm i
npx gulp
npm run website
```

and point your browser to: [localhost:8080](http://localhost:8080/)

### Mac OS X Users
If you're using a Apple Silicon Mac (M1 / M2 / etc) the project will likely struggle to build
due to mismatched dependencies and version (Node + Dgeni + Gulp, etc). 

We're working on cleaning up the process, but in the meantime the following should build dependencies as needed:
```shell
# First: fix website folder with dgeni
pushd website
volta pin node@10   
npm i -s fsevents@latest    
volta pin node@8
npx gulp dgeni  
popd

# Second: run the main gulp compilation
npm i
npx gulp
```

Once completed, you should be able to run the docs via `npm run website`
## How to run the tests

The website includes 3 types of tests:

* minijasminenode unit tests for the dgeni modules.
* karma unit tests for the angular controllers.
* protractor for e2e testing.

### Start the server first

The following command will start a server on [localhost:8080](http://localhost:8080/).
The server is used to run the protractor tests.

```shell
npm start
```

### Run all the tests

```shell
npm test
```

### Run the dgeni tests

```shell
./node_modules/.bin/minijasminenode docgen/spec/*
```

### Run the karma tests

```shell
./node_modules/karma/bin/karma start
```

### Run the protractor tests

```shell
../bin/protractor
```
