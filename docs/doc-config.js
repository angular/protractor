var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var basePackage = require('dgeni-packages/jsdoc');

module.exports = function (config) {

  config = basePackage(config);

  var processors =  config.processing.processors.concat([
    { name: 'do-stuff', runAfter: ['processing-docs'] }
  ]);


  config.append('processing.processors', [
    {
      name: 'do-stuff',
      description: 'Doing some stuff',
      runAfter: ['parsing-tags'],
      runBefore: ['tags-parsed'],
//      runAfter: ['rendering-docs'],
//      runBefore: ['docs-rendered'],
      init: function (config) {
//        console.log(config);
      },
      process: function (docs) {
        console.log(docs);
      }
    }
  ]);


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


  var docsPath = path.resolve(basePath, 'docs');
  config.set('rendering.templateFolders', [docsPath]);

  config.set('rendering.templatePatterns', [
    'api-template.md'
//    ,
//    '${ doc.template }',
//    '${doc.area}/${ doc.id }.${ doc.docType }.template.html',
//    '${doc.area}/${ doc.id }.template.html',
//    '${doc.area}/${ doc.docType }.template.html',
//    '${ doc.id }.${ doc.docType }.template.html',
//    '${ doc.id }.template.html',
//    '${ doc.docType }.template.html'
  ]);
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
