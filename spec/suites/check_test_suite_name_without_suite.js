describe('This test is not called inside a suite', function(){
    it('should have the name of the suite', function(){
        expect(protractor.currentSuite).toBe(undefined);
    });
});
