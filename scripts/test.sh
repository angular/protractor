#!/bin/bash

node lib/cli.js spec/basicConf.js
node lib/cli.js spec/multiConf.js
node lib/cli.js spec/altRootConf.js
node lib/cli.js spec/onPrepareConf.js
node lib/cli.js spec/mochaConf.js
node lib/cli.js spec/cucumberConf.js
node lib/cli.js spec/withLoginConf.js
node lib/cli.js spec/suitesConf.js --suite okmany
node lib/cli.js spec/suitesConf.js --suite okspec
node_modules/.bin/minijasminenode jasminewd/spec/adapterSpec.js spec/unit/*.js docs/spec/*.js
