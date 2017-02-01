"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Based off of spec/basic/elements_spec.js
const q = require("q");
const __1 = require("../../..");
describe('verify control flow is off', function () {
    it('should have set webdriver.promise.USE_PROMISE_MANAGER', () => {
        expect(__1.promise.USE_PROMISE_MANAGER).toBe(false);
    });
    it('should not wait on one command before starting another', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // Wait forever
            __1.browser.controlFlow().wait(__1.browser.controlFlow().promise(() => undefined));
            // then return
            yield __1.browser.controlFlow().execute(() => __1.promise.when(null));
        });
    });
});
describe('ElementFinder', function () {
    it('should return the same result as browser.findElement', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            const nameByElement = __1.element(__1.by.binding('username'));
            yield expect(nameByElement.getText())
                .toEqual(__1.browser.findElement(__1.by.binding('username')).getText());
        });
    });
    it('should wait to grab the WebElement until a method is called', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // These should throw no error before a page is loaded.
            const usernameInput = __1.element(__1.by.model('username'));
            const name = __1.element(__1.by.binding('username'));
            yield __1.browser.get('index.html#/form');
            yield expect(name.getText()).toEqual('Anon');
            yield usernameInput.clear();
            yield usernameInput.sendKeys('Jane');
            yield expect(name.getText()).toEqual('Jane');
        });
    });
    it('should chain element actions', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            const usernameInput = __1.element(__1.by.model('username'));
            const name = __1.element(__1.by.binding('username'));
            yield expect(name.getText()).toEqual('Anon');
            yield usernameInput.clear().sendKeys('Jane');
            yield expect(name.getText()).toEqual('Jane');
        });
    });
    it('should run chained element actions in sequence', function (done) {
        // Testing private methods is bad :(
        let els = new __1.ElementArrayFinder(__1.browser, () => {
            return __1.promise.when([null]);
        });
        let applyAction_ = __1.ElementArrayFinder.prototype.applyAction_;
        let order = [];
        let deferredA = q.defer();
        els = applyAction_.call(els, () => {
            return deferredA.promise.then(() => {
                order.push('a');
            });
        });
        let deferredB = q.defer();
        els = applyAction_.call(els, () => {
            return deferredB.promise.then(() => {
                order.push('b');
            });
        });
        deferredB.resolve();
        setTimeout(function () {
            return __awaiter(this, void 0, void 0, function* () {
                deferredA.resolve();
                yield els;
                expect(order).toEqual(['a', 'b']);
                done();
            });
        }, 100);
    });
    it('chained call should wait to grab the WebElement until a method is called', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // These should throw no error before a page is loaded.
            const reused = __1.element(__1.by.id('baz')).element(__1.by.binding('item.reusedBinding'));
            yield __1.browser.get('index.html#/conflict');
            yield expect(reused.getText()).toEqual('Inner: inner');
            yield expect(reused.isPresent()).toBe(true);
        });
    });
    it('should differentiate elements with the same binding by chaining', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/conflict');
            const outerReused = __1.element(__1.by.binding('item.reusedBinding'));
            const innerReused = __1.element(__1.by.id('baz')).element(__1.by.binding('item.reusedBinding'));
            yield expect(outerReused.getText()).toEqual('Outer: outer');
            yield expect(innerReused.getText()).toEqual('Inner: inner');
        });
    });
    it('should chain deeper than 2', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // These should throw no error before a page is loaded.
            const reused = __1.element(__1.by.css('body')).element(__1.by.id('baz')).element(__1.by.binding('item.reusedBinding'));
            yield __1.browser.get('index.html#/conflict');
            yield expect(reused.getText()).toEqual('Inner: inner');
        });
    });
    it('should allow handling errors', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            try {
                yield __1.$('.nopenopenope').getText();
                // The above line should have throw an error. Fail.
                yield expect(true).toEqual(false);
            }
            catch (e) {
                yield expect(true).toEqual(true);
            }
        });
    });
    it('should allow handling chained errors', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            try {
                yield __1.$('.nopenopenope').$('furthernope').getText();
                // The above line should have throw an error. Fail.
                yield expect(true).toEqual(false);
            }
            catch (e) {
                yield expect(true).toEqual(true);
            }
        });
    });
    it('should keep a reference to the original locator', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            const byCss = __1.by.css('body');
            const byBinding = __1.by.binding('greet');
            yield expect(__1.element(byCss).locator()).toEqual(byCss);
            yield expect(__1.element(byBinding).locator()).toEqual(byBinding);
        });
    });
    it('should propagate exceptions', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            const invalidElement = __1.element(__1.by.binding('INVALID'));
            const successful = invalidElement.getText().then(function () {
                return true;
            }, function () {
                return false;
            });
            yield expect(successful).toEqual(false);
        });
    });
    it('should be returned from a helper without infinite loops', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            const helperPromise = __1.promise.when(true).then(function () {
                return __1.element(__1.by.binding('greeting'));
            });
            yield helperPromise.then(function (finalResult) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield expect(finalResult.getText()).toEqual('Hiya');
                });
            });
        });
    });
    it('should be usable in WebDriver functions', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            const greeting = __1.element(__1.by.binding('greeting'));
            yield __1.browser.executeScript('arguments[0].scrollIntoView', greeting);
        });
    });
    it('should allow null as success handler', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            const name = __1.element(__1.by.binding('username'));
            yield expect(name.getText()).toEqual('Anon');
            yield expect(name.getText().then(null, function () { })).toEqual('Anon');
        });
    });
    it('should check equality correctly', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.browser.get('index.html#/form');
            const usernameInput = __1.element(__1.by.model('username'));
            const name = __1.element(__1.by.binding('username'));
            yield expect(usernameInput.equals(usernameInput)).toEqual(true);
            yield expect(usernameInput.equals(name)).toEqual(false);
        });
    });
});
//# sourceMappingURL=smoke_spec.js.map