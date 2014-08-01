var q = require('q');

module.exports = q.fcall(function() {
  browser.params.password = '12345';
}).delay(1000);
