"use strict";
// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor/globals'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor/globals';
//
// The jasmine typings are brought in via DefinitelyTyped ambient typings.
const protractor_1 = require('protractor');
describe('protractor with typescript typings', () => {
    beforeEach(() => {
        protractor_1.browser.get('http://www.angularjs.org');
    });
    it('should greet the named user', () => {
        protractor_1.element(protractor_1.by.model('yourName')).sendKeys('Julie');
        let greeting = protractor_1.element(protractor_1.by.binding('yourName'));
        expect(greeting.getText()).toEqual('Hello Julie!');
    });
    it('should list todos', function () {
        let todoList = protractor_1.element.all(protractor_1.by.repeater('todo in todoList.todos'));
        expect(todoList.count()).toEqual(2);
        expect(todoList.get(1).getText()).toEqual('build an angular app');
    });
});
