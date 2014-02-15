var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var basePackage = require('dgeni-packages/jsdoc');

module.exports = function (config) {

  config = basePackage(config);

  var basePath = path.resolve(packagePath);

  basePath = '/Users/andresdom/dev/protractor';

  config.set('source.files', [
    { pattern: 'lib/**/*.js', basePath: basePath }
//    ,
//    { pattern: '**/*.ngdoc', basePath: path.resolve(packagePath, 'content') }
  ]);

//  config.set('source.currentVersion', currentVersion);
//  config.set('source.previousVersions', previousVersions);

  config.set('rendering.outputFolder', 'build');

  config.set('logging.level', 'debug');

//  config.merge('rendering.extra', {
//    git: { owner: 'angular', repo: 'angular.js' },
//    version: currentVersion
//  });

//  config.set('processing.examples.commonFiles', {
//    scripts: [ '../../angular.js' ],
//    stylesheets: []
//  });

  return config;
};