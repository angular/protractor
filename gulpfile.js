'use strict';

var gulp = require('gulp');
var clangFormat = require('clang-format');
var gulpFormat = require('gulp-clang-format');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;

var runSpawn = function(done, task, opt_arg) {
  var child = spawn(task, opt_arg, {stdio: 'inherit'});
  child.on('close', function() {
    done();
  });
};

gulp.task('built:copy', function() {
  return gulp.src(['lib/**/*','!lib/**/*.ts'])
      .pipe(gulp.dest('built/'));
});

gulp.task('webdriver:update', function(done) {
  runSpawn(done, 'bin/webdriver-manager', ['update']);
});

gulp.task('jslint', function(done) {
  runSpawn(done, './node_modules/.bin/jshint', ['lib','spec', 'scripts']);
});

gulp.task('clang', function() {
  return gulp.src(['lib/**/*.ts'])
      .pipe(gulpFormat.checkFormat('file', clangFormat))
      .on('warning', function(e) {
    console.log(e);
  });
});

gulp.task('typings', function(done) {
  runSpawn(done, 'node_modules/.bin/typings', ['install']);
});

gulp.task('tsc', function(done) {
  runSpawn(done, 'node_modules/typescript/bin/tsc');
});

gulp.task('prepublish', function(done) {
  runSequence(['typings', 'jslint', 'clang'],'tsc', 'built:copy', done);
});

gulp.task('pretest', function(done) {
  runSequence(
    ['webdriver:update', 'typings', 'jslint', 'clang'], 'tsc', 'built:copy', done);
});
