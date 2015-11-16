// Use the external Chai As Promised to deal with resolving promises in
// expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var child_process = require('child_process'),
    q = require('q'),
    fs = require('fs');



var expect = chai.expect;

function spawnCucumberTests(configFile) {
  return q.promise(function(resolve, reject) {
    
      var output = '';
      var test_process;
      test_process = child_process.spawn('node',['lib/cli.js',configFile]);

   
      test_process.on('error', function(err) {
        reject(err);
      });

      test_process.on('exit', function(exitCode) {
        resolve(exitCode);
      });
    });
}

// Chai's expect().to.exist style makes default jshint unhappy.
// jshint expr:true

describe('generate reports for cucumber', function() {
  

  it('should generate a report in the specified file', function(done) {

    this.timeout(10000);
    var cucumberTestProcess = spawnCucumberTests('spec/cucumber-report/cucumberConfReportFile.js');
    expect(cucumberTestProcess).to.eventually.equal(0).then(function() {
      console.log('now check file');
      return expect(q.promise(function(resolve,reject)
        { 
          fs.exists('cucumberReport.tmp',resolve);
        }
        )).to.eventually.be.true;
    }).then(function(){
       console.log('now deleting file');
       return q.promise(function(resolve,reject) { fs.unlink('cucumberReport.tmp',resolve); });
    }).then(done,done);
    
  });

  it('should generate a report in the specified logTo function', function(done) {

    this.timeout(10000);
    var cucumberTestProcess = spawnCucumberTests('spec/cucumber-report/cucumberConfReportFunction.js');
    expect(cucumberTestProcess).to.eventually.equal(0).then(function() {
      console.log('now check file');
      return expect(q.promise(function(resolve,reject)
        { 
          fs.exists('cucumberReportFunc.tmp',resolve);
        }
        )).to.eventually.be.true;
    }).then(function(){
       console.log('now deleting file');
       return q.promise(function(resolve,reject) { fs.unlink('cucumberReportFunc.tmp',resolve); });
    }).then(done,done);
    
  });

});
