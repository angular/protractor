"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const __1 = require("../../..");
describe('category', function () {
    it('name', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html');
            yield expect(__1.protractor.ON_PAGE_LOAD).toBe(true);
        });
    });
});
//# sourceMappingURL=plugin_spec.js.map