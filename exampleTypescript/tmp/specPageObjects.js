"use strict";
// local import of the exported AngularPage class
const angularPage_1 = require('./angularPage');
// The jasmine typings are brought in via DefinitelyTyped ambient typings.
describe('angularjs homepage', () => {
    it('should greet the named user', () => {
        let angularHomepage = new angularPage_1.AngularHomepage();
        angularHomepage.get();
        angularHomepage.setName('Julie');
        expect(angularHomepage.getGreeting()).toEqual('Hello Julie!');
    });
});
