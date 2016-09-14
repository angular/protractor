"use strict";
var router_1 = require('@angular/router');
var home_component_1 = require('./home/home.component');
var async_component_1 = require('./async/async.component');
exports.routes = [
    { path: '', component: home_component_1.HomeComponent },
    { path: 'async', component: async_component_1.AsyncComponent }
];
exports.appRouting = router_1.RouterModule.forRoot(exports.routes, { useHash: true });
//# sourceMappingURL=app.routes.js.map