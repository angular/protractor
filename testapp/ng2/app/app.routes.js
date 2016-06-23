System.register(['@angular/router', './home/home.component', './async/async.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_1, home_component_1, async_component_1;
    var routes, APP_ROUTER_PROVIDERS;
    return {
        setters:[
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (home_component_1_1) {
                home_component_1 = home_component_1_1;
            },
            function (async_component_1_1) {
                async_component_1 = async_component_1_1;
            }],
        execute: function() {
            exports_1("routes", routes = [
                { path: '', component: home_component_1.HomeComponent },
                { path: 'async', component: async_component_1.AsyncComponent }
            ]);
            exports_1("APP_ROUTER_PROVIDERS", APP_ROUTER_PROVIDERS = [
                router_1.provideRouter(routes)
            ]);
        }
    }
});
//# sourceMappingURL=app.routes.js.map