"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var static_1 = require("@angular/upgrade/static");
var ng1_1 = require("./ng1");
var ng2_ngfactory_1 = require("./ng2.ngfactory");
// Bootstrap Ng1 app as usual, but add a downgradedModule for the Angular (2+)
// part of the application.
angular.bootstrap(document.body, [ng1_1.ng1module.name, static_1.downgradeModule(ng2_ngfactory_1.AppModuleNgFactory)]);
//# sourceMappingURL=main.js.map