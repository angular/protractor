'use strict';

var gulp = require('gulp');
var clangFormat = require('clang-format');
var gulpFormat = require('gulp-clang-format');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var glob = require('glob');

var runSpawn = function(done, task, opt_arg, opt_io) {
  opt_arg = typeof opt_arg !== 'undefined' ? opt_arg : [];
  var stdio = 'inherit';
  if (opt_io === 'ignore') {
    stdio = 'ignore';
  }
  var child = spawn(task, opt_arg, {stdio: stdio});
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
  runSpawn(done, 'node', ['node_modules/jshint/bin/jshint', 'lib', 'spec', 'scripts',
      '--exclude=lib/selenium-webdriver/**/*.js,spec/dependencyTest/*.js,' +
      'spec/install/**/*.js']);
});

gulp.task('format:enforce', () => {
  const format = require('gulp-clang-format');
  const clangFormat = require('clang-format');
  return gulp.src(['lib/**/*.ts']).pipe(
    format.checkFormat('file', clangFormat, {verbose: true, fail: true}));
});

gulp.task('format', () => {
  const format = require('gulp-clang-format');
  const clangFormat = require('clang-format');
  return gulp.src(['lib/**/*.ts'], { base: '.' }).pipe(
    format.format('file', clangFormat)).pipe(gulp.dest('.'));
});

gulp.task('typings', function(done) {
  runSpawn(done, 'node', ['node_modules/typings/dist/bin.js', 'install']);
});

gulp.task('tsc', function(done) {
  runSpawn(done, 'node', ['node_modules/typescript/bin/tsc']);
});

gulp.task('tsc:globals', function(done) {
  runSpawn(done, 'node', ['node_modules/typescript/bin/tsc', 'globals.ts'],
    'ignore');
});

gulp.task('prepublish', function(done) {
  runSequence(['typings', 'jshint', 'format'], 'tsc', 'tsc:globals', 'types',
    'ambient', 'built:copy', done);
});

gulp.task('pretest', function(done) {
  runSequence(
    ['webdriver:update', 'typings', 'jshint', 'format'], 'tsc', 'tsc:globals',
    'types', 'ambient', 'built:copy', done);
});

gulp.task('default',['prepublish']);

gulp.task('types', function(done) {
  var folder = 'built';
  var files = ['browser', 'element', 'locators', 'expectedConditions',
    'config', 'plugins', 'ptor'];
  var outputFile = path.resolve(folder, 'index.d.ts');
  var contents = '';
  files.forEach(file => {
    contents += parseTypingsFile(folder, file);
  });

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
  // Remove new lines inside types
  fileContents = fileContents.replace(
    /webdriver.promise.Promise<\{[a-zA-Z:,; \n]+\}>/g, (type) => {
        return type.replace(/\n/g, '');
    }
  );
  var lines = fileContents.split('\n');
  var contents = '';
  for (var linePos in lines) {
    var line = lines[linePos];
    if (!line.startsWith('import')) {
      if (line.indexOf('declare') !== -1) {
        line = line.replace('declare', '').trim();
      }

      // Remove webdriver types, q, http proxy agent
      line = removeTypes(line,'webdriver.ActionSequence');
      line = removeTypes(line,'webdriver.promise.Promise<[a-zA-Z{},:; ]+>');
      line = removeTypes(line,'webdriver.util.Condition');
      line = removeTypes(line,'webdriver.WebDriver');
      line = removeTypes(line,'webdriver.Locator');
      line = removeTypes(line,'webdriver.WebElement');
      line = removeTypes(line,'HttpProxyAgent');
      line = removeTypes(line,'Q.Promise<[a-zA-Z{},:; ]+>');
      contents += line + '\n';
    }
  }
  return contents;
}

var removeTypes = function(line, webdriverType) {
  var tempLine = line.trim();
  if (tempLine.startsWith('/**') || tempLine.startsWith('*')) {
    return line;
  }
  return line.replace(new RegExp(webdriverType,'g'), 'any');
}

gulp.task('ambient', function(done) {
  var fileContents = fs.readFileSync(path.resolve('built/index.d.ts')).toString();
  var contents = '';
  contents += 'declare namespace protractor {\n';
  contents += fileContents + '\n';
  contents += '}\n';
  contents += 'declare module "protractor" {\n';

  contents += '  export = protractor; \n';
  contents += '}\n';
  fs.writeFileSync(path.resolve('built/ambient.d.ts'), contents);
  done();
});
