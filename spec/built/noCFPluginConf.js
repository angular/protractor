"use strict";
const q = require("q");
const __1 = require("../..");
const env = require('../environment.js');
exports.config = {
    seleniumAddress: env.seleniumAddress,
    framework: 'jasmine',
    specs: [
        'noCF/plugin_spec.js'
    ],
    capabilities: env.capabilities,
    baseUrl: env.baseUrl + '/ng1/',
    plugins: [{
            inline: {
                onPageLoad: function () {
                    //TODO: remove cast when @types/selenium-webdriver understands disabling the control flow
                    return q.delay(100).then(function () {
                        __1.protractor.ON_PAGE_LOAD = true;
                    });
                }
            }
        }],
    SELENIUM_PROMISE_MANAGER: false
};
//# sourceMappingURL=noCFPluginConf.js.map