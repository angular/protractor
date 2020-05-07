'use strict';

const gulp = require('gulp');
const format = require('gulp-clang-format');
const clangFormat = require('clang-format');
const spawn = require('child_process').spawn;
const tslint = require('gulp-tslint');
const fs = require('fs');
const path = require('path');
const semver = require('semver');

const runSpawn = (done, task, opt_arg, opt_io) => {
  opt_arg = typeof opt_arg !== 'undefined' ? opt_arg : [];
  const stdio = 'inherit';
  if (opt_io === 'ignore') {
    stdio = 'ignore';
  }
  const child = spawn(task, opt_arg, {stdio: stdio});
  let running = false;
  child.on('close', () => {
    if (!running) {
      running = true;
      done();
    }
  });
  child.on('error', () => {
    if (!running) {
      console.error('gulp encountered a child error');
      running = true;
      done();
    }
  });
};

gulp.task('tslint', () => {
  return gulp.src(['lib/**/*.ts', 'spec/**/*.ts', '!spec/install/**/*.ts'])
      .pipe(tslint())
      .pipe(tslint.report());
});

gulp.task('format:enforce', () => {
  return gulp.src(['lib/**/*.ts'])
      .pipe(format.checkFormat('file', clangFormat,
      {verbose: true, fail: true}));
});

gulp.task('lint', gulp.series('tslint', 'format:enforce'));

// prevent contributors from using the wrong version of node
gulp.task('checkVersion', (done) => {
  // read minimum node on package.json
  const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json')));
  const protractorVersion = packageJson.version;
  const nodeVersion = packageJson.engines.node;

  if (semver.satisfies(process.version, nodeVersion)) {
    done();
  } else {
    throw new Error('minimum node version for Protractor ' +
        protractorVersion + ' is node ' + nodeVersion);
  }
});

gulp.task('built:copy', () => {
  return gulp.src(['lib/**/*.js'])
      .pipe(gulp.dest('built/'));
});

gulp.task('built:copy:typings', () => {
  return gulp.src(['lib/selenium-webdriver/**/*.d.ts'])
      .pipe(gulp.dest('built/selenium-webdriver/'));
});

gulp.task('webdriver:update', (done) => {
  runSpawn(done, 'node', ['bin/webdriver-manager', 'update',
  '--versions.chrome=2.44']);
});

gulp.task('format', () => {
  return gulp.src(['lib/**/*.ts'], { base: '.' })
      .pipe(format.format('file', clangFormat))
      .pipe(gulp.dest('.'));
});

gulp.task('tsc', (done) => {
  runSpawn(done, 'node', ['node_modules/typescript/bin/tsc']);
});

gulp.task('tsc:spec', (done) => {
  runSpawn(done, 'node', ['node_modules/typescript/bin/tsc', '-p', 'ts_spec_config.json']);
});

gulp.task('prepublish', gulp.series('checkVersion', 'tsc', 'built:copy'));

gulp.task('pretest', gulp.series(
  'checkVersion',
  gulp.parallel('webdriver:update', 'tslint', 'format'),
  'tsc', 'built:copy', 'built:copy:typings', 'tsc:spec'));

gulp.task('default', gulp.series('prepublish'));
