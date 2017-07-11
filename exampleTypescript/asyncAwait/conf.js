"use strict";
exports.config = {
    framework: 'jasmine',
    capabilities: {
        browserName: 'chrome'
    },
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // You could set no globals to true to avoid jQuery '$' and protractor '$'
    // collisions on the global namespace.
    noGlobals: true,
    specs: [
          'spec.ts'
        ],
    SELENIUM_PROMISE_MANAGER: false,
    beforeLaunch: function() {
          require('ts-node').register({
                  project: '.'
                });
        }
};
