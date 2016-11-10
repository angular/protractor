var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { browser, element, by } from 'protractor/globals';
describe('async function', function () {
    it('should wait on async function in conditional', function () {
        return __awaiter(this, void 0, void 0, function* () {
            browser.get('http://www.angularjs.org');
            let todoList = element.all(by.repeater('todo in todoList.todos'));
            if ((yield todoList.count()) > 1) {
                expect(todoList.get(1).getText()).toEqual('build an angular app');
            }
        });
    });
});
