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

gulp.task('create-md-files', function () {
  return docGenerator('doc-config.js').generateDocs();
});

gulp.task('concat-md', function () {
  return gulp.src(paths.protractor).
      pipe(concat('protractor.md')).
      pipe(gulp.dest('.'));
});


// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['default']);
});

gulp.task('generate-docs', ['clean', 'create-md-files', 'concat-md']);
gulp.task('default', ['generate-docs']);
