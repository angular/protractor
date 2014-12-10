// var ReplProvider = function(client, replServer, prompt) {
//   this.client = client; 
//   this.replServer = replServer;
//   this.prompt = prompt;
// };

// ReplProvider.prototype.setup = function() {
//   this.replServer.prompt = this.prompt;
//   this.replServer.complete = this.complete_.bind(this);
//   this.client.on('break', this.onbreak_.bind(this));
// };

// ReplProvider.prototype.teardown = function() {
//   this.replServer.prompt = '';
//   this.replServer.complete = null;
//   this.client.removeAllListeners('break');
// };

// ReplProvider.prototype.eval = function(cmd, callback) {
//   throw 'Unimplemented function: "eval"';
// };

// ReplProvider.prototype.complete_ = function(line, completeCallback) {
//   throw 'Unimplemented function: "complete_"';
// };

// ReplProvider.prototype.onbreak_ = function() {
//   throw 'Unimplemented function: "onbreak_"';
// };

// module.exports = ReplProvider;
