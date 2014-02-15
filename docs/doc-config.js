var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var basePackage = require('dgeni-packages/jsdoc');

module.exports = function (config) {

  config = basePackage(config);

  config.set('source.files', [
    { pattern: 'src/**/*.js', basePath: path.resolve(packagePath) },
    { pattern: '**/*.ngdoc', basePath: path.resolve(packagePath, 'content') }
  ]);

  var currentVersion = { full: '1.2.10', major: '1', minor: '2', dot: '10', codeName: 'BruceBogTrotter', cdn: '1.2.10' };

  var previousVersions = [
    { full: '1.2.9', major: '1', minor: '2', dot: '9', codeName: 'BruceBogTrotter', cdn: '1.2.9' },
    { full: '1.2.8', major: '1', minor: '2', dot: '8', codeName: 'HarryHoudini', cdn: '1.2.8' },
    { full: '1.2.7', major: '1', minor: '2', dot: '7', codeName: 'RolandFromGrangeHill', cdn: '1.2.7' },
    { full: '1.2.6', major: '1', minor: '2', dot: '6', codeName: 'IceIceBaby', cdn: '1.2.6' },
    { full: '1.1.5', major: '1', minor: '1', dot: '5', codeName: 'StepToeAndSon', cdn: '1.1.5' },
    { full: '1.1.4', major: '1', minor: '1', dot: '4', codeName: 'XFactorChamp', cdn: '1.1.4' },
    { full: '1.1.3', major: '1', minor: '1', dot: '3', codeName: 'MastersOfTheUniverse', cdn: '1.1.3' }
  ];

  config.set('source.currentVersion', currentVersion);
  config.set('source.previousVersions', previousVersions);

  config.set('rendering.outputFolder', 'build');

  config.set('logging.level', 'debug');

  config.merge('rendering.extra', {
    git: { owner: 'angular', repo: 'angular.js' },
    version: currentVersion
  });

  config.set('processing.examples.commonFiles', {
    scripts: [ '../../angular.js' ],
    stylesheets: []
  });

  config.merge('deployment', {
    environments: [
      {
        name: 'debug',
        scripts: [
          'angular.js',
          'angular-resource.js',
          'angular-route.js',
          'angular-cookies.js',
          'angular-sanitize.js',
          'angular-touch.js',
          'angular-animate.js',
          'components/marked/lib/marked.js',
          'js/angular-bootstrap/bootstrap.js',
          'js/angular-bootstrap/bootstrap-prettify.js',
          'components/lunr.js/lunr.js',
          'components/google-code-prettify/src/prettify.js',
          'components/google-code-prettify/src/lang-css.js',
          'js/versions-data.js',
          'js/pages-data.js',
          'js/docs.js'
        ],
        stylesheets: [
          'css/bootstrap/css/bootstrap.css',
          'components/open-sans-fontface/open-sans.css',
          'css/prettify-theme.css',
          'css/docs.css',
          'css/animations.css'
        ]
      },
      {
        name: 'default',
        scripts: [
          'angular.min.js',
          'angular-resource.min.js',
          'angular-route.min.js',
          'angular-cookies.min.js',
          'angular-sanitize.min.js',
          'angular-touch.min.js',
          'angular-animate.min.js',
          'components/marked/lib/marked.js',
          'js/angular-bootstrap/bootstrap.js',
          'js/angular-bootstrap/bootstrap-prettify.js',
          'components/lunr.js/lunr.min.js',
          'components/google-code-prettify/src/prettify.js',
          'components/google-code-prettify/src/lang-css.js',
          'js/versions-data.js',
          'js/pages-data.js',
          'js/docs.js'
        ],
        stylesheets: [
          'css/bootstrap/css/bootstrap.css',
          'components/open-sans-fontface/open-sans.css',
          'css/prettify-theme.css',
          'css/docs.css',
          'css/animations.css'
        ]
      }
    ]
  });

  return config;
};