'use strict';

var gulp = require('gulp');
var clangFormat = require('clang-format');
var gulpFormat = require('gulp-clang-format');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var glob = require('glob');

var runSpawn = function(done, task, opt_arg) {
  opt_arg = typeof opt_arg !== 'undefined' ? opt_arg : [];
  var child = spawn(task, opt_arg, {stdio: 'inherit'});
  var running = false;
  child.on('close', function() {
    if (!running) {
      running = true;
      done();
    }
  });
  child.on('error', function() {
    if (!running) {
      console.error('gulp encountered a child error');
      running = true;
      done();
    }
  });
};

gulp.task('built:copy', function() {
  return gulp.src(['lib/**/*','!lib/**/*.ts'])
      .pipe(gulp.dest('built/'));
});

gulp.task('webdriver:update', function(done) {
  runSpawn(done, 'node', ['bin/webdriver-manager', 'update']);
});

gulp.task('jshint', function(done) {
  runSpawn(done, 'node', ['node_modules/jshint/bin/jshint', 'lib',
      'spec', 'scripts', '--exclude=lib/selenium-webdriver/**/*.js']);
});

gulp.task('clang', function() {
  return gulp.src(['lib/**/*.ts'])
      .pipe(gulpFormat.checkFormat('file', clangFormat))
      .on('warning', function(e) {
    console.log(e);
  });
});

gulp.task('typings', function(done) {
  runSpawn(done, 'node', ['node_modules/typings/dist/bin.js', 'install']);
});

gulp.task('tsc', function(done) {
  runSpawn(done, 'node', ['node_modules/typescript/bin/tsc']);
});

gulp.task('prepublish', function(done) {
  runSequence(['typings', 'jshint', 'clang'], 'tsc', 'types', 'built:copy', done);
});

gulp.task('pretest', function(done) {
  runSequence(
    ['webdriver:update', 'typings', 'jshint', 'clang'], 'tsc', 'types',
    'built:copy', done);
});

gulp.task('default',['prepublish']);

gulp.task('types', function(done) {
  var folder = 'built';
  var files = ['ptor', 'browser', 'locators'];
  var outputFile = path.resolve(folder, 'index.d.ts');
  var contents = '';
  files.forEach(file => {
    contents += parseTypingsFile(folder, file);
  });

  // add module declaration
  contents += 'declare module "protractor" {\n';
  contents += '  export = protractor\n';
  contents += '}\n';

  // remove files with d.ts
  glob.sync(folder + '/**/*.d.ts').forEach(file => {
    fs.unlinkSync(path.resolve(file));
  });

  // write contents to 'built/index.d.ts'
  fs.writeFileSync(outputFile, contents);
  done();
});

var parseTypingsFile = function(folder, file) {
  var fileContents = fs.readFileSync(path.resolve(folder, file + '.d.ts')).toString();
  var lines = fileContents.split('\n');
  var contents = '';
  for (var linePos in lines) {
    var line = lines[linePos];
    if (!line.startsWith('import')) {
      if (line.indexOf('export') !== -1) {
        line = line.replace('export', '').trim();
      }
      contents += line + '\n';
    }
  }
  return contents;
}
