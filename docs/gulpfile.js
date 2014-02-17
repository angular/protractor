var gulp = require('gulp');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var docGenerator = require('dgeni');


var paths = {
  protractor: 'build/**/protractor*',
  scripts: [
    'api-template.md',
    'processors/*',
    'doc-config.js'
  ]
};

gulp.task('clean', function () {
  return gulp.src('build', {read: false}).
      pipe(rimraf());
});

gulp.task('generate-docs', ['clean'], function () {
  return docGenerator('doc-config.js').generateDocs();
});

gulp.task('prepare-docs', function () {
  return gulp.src(paths.protractor).
      pipe(concat('protractor.md')).
      pipe(gulp.dest('build'));
});


// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['default']);
});

gulp.task('default', ['generate-docs', 'prepare-docs']);
