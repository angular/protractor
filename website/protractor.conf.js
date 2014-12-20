var shardCount = 2;

exports.config = {
  directConnect: true,

  // Spec patterns are relative to the location of this config.
  specs: [
    'test/e2e/*_spec.js'
  ],

  maxSessions: shardCount,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {args: ['--disable-extensions']},
    maxInstances: shardCount,
    shardTestFiles: true
  },

  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:8080',

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 10000
  }
};
