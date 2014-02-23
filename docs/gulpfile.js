var gulp = require('gulp');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var docGenerator = require('dgeni');


var paths = {
  protractor: 'build/**/protractor*',
  webdriver: 'build/**/webdriver*',
  locators: 'build/**/locators*',
  toc: 'build/**/toc.md',
  scripts: [
    'api-template.md',
    'processors/*',
    'doc-config.js'
  ]
};

gulp.task('clean', function() {
  return gulp.src('build', {read: false}).
      pipe(rimraf());
});

// Create a file for each function in protractor.js and webdriver.js.
gulp.task('create-md-files', ['clean'], function() {
  return docGenerator('doc-config.js').generateDocs();
});

// Concatenate all the files into a single doc.
gulp.task('concat-md', ['create-md-files'], function() {
  gulp.src(paths.protractor).
      pipe(concat('protractor.md')).
      pipe(gulp.dest('.'));

  gulp.src(paths.webdriver).
      pipe(concat('webdriver.md')).
      pipe(gulp.dest('.'));

  gulp.src(paths.locators).
      pipe(concat('locators.md')).
      pipe(gulp.dest('.'));

  var paths2 = [paths.toc, paths.locators, paths.protractor, paths.webdriver];
  gulp.src(paths2).
      pipe(concat('api.md')).
      pipe(gulp.dest('.'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['default']);
});

gulp.task('default', ['concat-md']);
