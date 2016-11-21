"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var static_1 = require('@angular/upgrade/static');
var module_1 = require('./module');
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(module_1.AppModule).then(function (platformRef) {
    var upgrade = platformRef.injector.get(static_1.UpgradeModule);
    upgrade.bootstrap(document.body, ['upgradeApp'], { strictDi: true });
});
//# sourceMappingURL=main.js.map