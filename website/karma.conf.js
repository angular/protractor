module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/lodash/dist/lodash.min.js',
      'js/modules.js',
      'js/*.js',
      'test/unit/*.js'
    ],
    exclude: [
      'js/bootstrap.min.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
