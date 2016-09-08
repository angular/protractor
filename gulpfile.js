'use strict';

var gulp = require('gulp');
var clangFormat = require('clang-format');
var gulpFormat = require('gulp-clang-format');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
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

// prevent contributors from using the wrong version of node
gulp.task('checkVersion', function(done) {
  var version = spawnSync('node', ['--version']).stdout.toString();
  var versionArray = version.replace('v', '').split('.');
  var major = versionArray[0];
  var minor = versionArray[1];

  // read minimum node on package.json
  var packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json')));
  var protractorVersion = packageJson.version;
  var nodeVersion = packageJson.engines.node.replace('>=','');
  var nodeVersionArray = nodeVersion.split('.');
  var requiredMajor = nodeVersionArray[0];
  var requiredMinor = nodeVersionArray[1];

  if (major >= requiredMajor && minor >= requiredMinor) {
    done();
  } else {
    console.error('minimum node version for Protractor ' + protractorVersion +
      ' is node >= ' + nodeVersion);
    return 1;
  }
});

gulp.task('built:copy', function() {
  return gulp.src(['lib/**/*.js','lib/globals.d.ts'])
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

gulp.task('format:enforce', function() {
  var format = require('gulp-clang-format');
  var clangFormat = require('clang-format');
  return gulp.src(['lib/**/*.ts']).pipe(
    format.checkFormat('file', clangFormat, {verbose: true, fail: true}));
});

gulp.task('format', function() {
  var format = require('gulp-clang-format');
  var clangFormat = require('clang-format');
  return gulp.src(['lib/**/*.ts'], { base: '.' }).pipe(
    format.format('file', clangFormat)).pipe(gulp.dest('.'));
});

gulp.task('tsc', function(done) {
  runSpawn(done, 'node', ['node_modules/typescript/bin/tsc']);
});

gulp.task('tsc:globals', function(done) {
  runSpawn(done, 'node', ['node_modules/typescript/bin/tsc', '-d', 'globals.ts'],
    'ignore');
});

gulp.task('prepublish', function(done) {
  runSequence('checkVersion', ['jshint', 'format'], 'tsc', 'tsc:globals', 'types',
    'ambient', 'built:copy', done);
});

gulp.task('pretest', function(done) {
  runSequence('checkVersion',
    ['webdriver:update', 'jshint', 'format'], 'tsc', 'tsc:globals',
    'types', 'ambient', 'built:copy', done);
});

gulp.task('default',['prepublish']);

gulp.task('types', function(done) {
  var folder = 'built';
  var files = ['browser', 'element', 'locators', 'expectedConditions',
    'config', 'plugins', 'ptor'];
  var outputFile = path.resolve(folder, 'index.d.ts');
  var contents = '';
  contents += '/// <reference path="../typings/index.d.ts" />\n';
  contents += '/// <reference path="./globals.d.ts" />\n';
  contents += 'import {ActionSequence, By, WebDriver, WebElement, WebElementPromise, promise, promise as wdpromise, until} from \'selenium-webdriver\';\n';
  files.forEach(function(file) {
    contents += parseTypingsFile(folder, file);
  });

  // remove files with d.ts
  glob.sync(folder + '/**/*.d.ts').forEach(function(file) {
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
    /webdriver.promise.Promise<\{[a-zA-Z:,; \n]+\}>/g, function(type) {
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
