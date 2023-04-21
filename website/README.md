Protractor website
==================

Generates the documentation for the protractor website.

## How to run

```shell
npm i
npm run build
cd website/
npm install
npm run build
```

Then copy all the files from the `build` directory to the gh-pages branch.
If you want to run the website locally then run the following command:

```shell
npm run website
```

And point your browser to: [localhost:8080](http://localhost:8080/)


### Build Failures on Apple Silicon / Arm64

Some of the nested dependencies do not have compatible binaries for newer architectures. This generally presents as a fatal failure like the following: 
```
#
# Fatal error in , line 0
# Check failed: !value_obj->IsJSReceiver() || value_obj->IsTemplateInfo().
#
#
#
#FailureMessage Object: 0x306a626c0
```

Eventually the project should migrate to Gulp 5 / Node 18+ to solve this issue, but in the meantime a simple workaround is: 
1. `cd website`
2. `npm i && npm run arm64_repair`
3. `npx gulp liveReload` (to avoid the `prestart` script)

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
