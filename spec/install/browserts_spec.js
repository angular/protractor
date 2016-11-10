"use strict";
var protractor_1 = require('protractor');
describe('browser', function () {
    var session1;
    var session2;
    afterEach(function () {
        protractor_1.browser.restart();
    });
    it('should load a browser session', function (done) {
        protractor_1.browser.get('http://angularjs.org');
        protractor_1.browser.getSession().then(function (session) {
            session1 = session.getId();
            expect(session1).not.toBeUndefined();
        }).catch(function (err) {
            done.fail('session should be defined');
        });
        done();
    });
    it('should have a new browser session', function (done) {
        protractor_1.browser.get('http://angularjs.org');
        protractor_1.browser.getSession().then(function (session) {
            session2 = session.getId();
            expect(session2).not.toBeUndefined();
            expect(session1).not.toEqual(session2);
        }).catch(function (err) {
            done.fail('session should be defined');
        });
        done();
    });
});
