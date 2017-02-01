"use strict";
const env = require('../environment.js');
exports.config = {
    seleniumAddress: env.seleniumAddress,
    framework: 'jasmine',
    specs: [
        'noCF/smoke_spec.js'
    ],
    capabilities: env.capabilities,
    baseUrl: env.baseUrl + '/ng1/',
    SELENIUM_PROMISE_MANAGER: false
};
//# sourceMappingURL=noCFSmokeConf.js.map