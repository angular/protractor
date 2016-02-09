'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var spawnSync = require('child_process').spawnSync;

gulp.task('built:copy', function() {
  var srcFiles = ['lib/**/*'];
  var dist = 'built/';
  return gulp.src(srcFiles).pipe(gulp.dest(dist));
});

gulp.task('webdriver:update', function() {
  var child = spawnSync('bin/webdriver-manager', ['update']);
  if (child.stdout != null) {
    console.log(child.stdout.toString());
  }
  if (child.status !== 0) {
    throw new Error('webdriver-manager update: child error');
  }
});

gulp.task('jslint', function() {
  var child = spawnSync('./node_modules/.bin/jshint', ['lib','spec', 'scripts']);
  if (child != null && child.stdout != null ) {
    console.log(child.stdout.toString());
  }
  if (child.status !== 0) {
    throw new Error('jslint: child error');
  }
});

gulp.task('pretest', function() {
  runSequence(
    ['webdriver:update', 'jslint'],
    'built:copy'
  );
});
gulp.task('prepublish', ['built:copy']);
