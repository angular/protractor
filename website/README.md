Protractor website
==================

Generates the documentation for the protractor website.

## How to run

```shell
npm run compile_to_es5
cd website/
npm install
npm run build
```

Then copy all the files from the `build` directory to the gh-pages branch.
If you want to run the website locally then run the following command:

```shell
npm start
```

And point your browser to: [localhost:8080](http://localhost:8080/)

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
