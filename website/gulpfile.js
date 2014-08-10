var concat = require('gulp-concat');
var connect = require('gulp-connect');
var del = require('del');
var dgeni = require('dgeni');
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var path = require('path');

var paths = {
  build: ['build', 'docgen/build'],
  dgeniTemplates: ['docgen/templates/*.txt', 'docgen/processors/*.js'],
  html: ['index.html', 'partials/*.html'],
  js: [
    'js/modules.js',
    'js/**/*.js'
  ],
  less: ['css/protractor.less'],
  outputDir: 'build/'
};

gulp.task('clean', function(cb) {
  del(paths.build, cb);
});

// Generate the table of contents json file using Dgeni.
gulp.task('dgeni', function() {
  var config = path.resolve(__dirname, './docgen/dgeni-config.js');
  dgeni(config).generateDocs();
});

gulp.task('copyBowerFiles', function() {
  // Bootstrap, lodash.
  gulp.src([
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/lodash/dist/lodash.min.js'
  ]).pipe(gulp.dest('js'));
  gulp.src('bower_components/bootstrap/dist/css/bootstrap.min.css')
      .pipe(gulp.dest('css'));
});

gulp.task('copyFiles', function() {
  // html.
  gulp.src('index.html')
      .pipe(gulp.dest(paths.outputDir));
  gulp.src('partials/*.html')
      .pipe(gulp.dest(paths.outputDir+ '/partials'));

  // Degeni docs.
  gulp.src(['docgen/build/*.json'])
      .pipe(gulp.dest(paths.outputDir + '/apiDocs'));

  // Images.
  gulp.src('img/**')
      .pipe(gulp.dest('build/img'));
});

gulp.task('js', function() {
  gulp.src(paths.js)
      .pipe(concat('protractorApp.js'))
      .pipe(gulp.dest(paths.outputDir))
});

gulp.task('less', function() {
  gulp.src(paths.less)
      .pipe(less())
      .pipe(minifyCSS())
      .pipe(gulp.dest(paths.outputDir + '/css'))
});

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true,
    open: {
      browser: 'Google Chrome'
    }
  });
});

gulp.task('reloadServer', function() {
  gulp.src(paths.outputDir)
      .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.html, ['copyFiles', 'reloadServer']);
  gulp.watch(paths.js, ['js', 'reloadServer']);
  gulp.watch(paths.less, ['less', 'reloadServer']);
  gulp.watch(paths.dgeniTemplates, ['dgeni', 'copyFiles', 'reloadServer']);
});

gulp.task('default', [
  'copyBowerFiles',
  'dgeni',
  'less',
  'js',
  'copyFiles',
  'connect',
  'watch'
]);
