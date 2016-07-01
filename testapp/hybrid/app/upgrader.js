System.register(['@angular/upgrade'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var upgrade_1;
    var adapter;
    return {
        setters:[
            function (upgrade_1_1) {
                upgrade_1 = upgrade_1_1;
            }],
        execute: function() {
            exports_1("adapter", adapter = new upgrade_1.UpgradeAdapter());
        }
    }
});
//# sourceMappingURL=upgrader.js.map