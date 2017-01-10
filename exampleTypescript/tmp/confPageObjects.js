"use strict";
exports.config = {
    framework: 'jasmine',
    capabilities: {
        browserName: 'chrome'
    },
    specs: ['specPageObjects.js'],
    seleniumAddress: 'http://localhost:4444/wd/hub'
};
