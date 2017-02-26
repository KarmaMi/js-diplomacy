const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const gutil = require('gulp-util')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const through = require('through2')
const merge = require('merge2')

const ts = require('gulp-typescript')
const tsify = require('tsify')
const typedoc = require('gulp-typedoc')
const sourcemaps = require('gulp-sourcemaps')

const mocha = require('gulp-mocha')

const browserify = require('browserify')

const tsSourceProject = ts.createProject('./tsconfig.json')
const tsTestProject = ts.createProject('./tsconfig.json')
const tsCompilerOptions = require('./tsconfig.json').compilerOptions

// compile source files
gulp.task('compile-src', () => {
  const tsResult = gulp.src(['./src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsSourceProject(ts.reporter.defaultReporter()))

  return merge([
    tsResult.dts.pipe(gulp.dest('./target/interface')),
    tsResult.js
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./target/src'))
  ])
})

// compile test files
gulp.task('compile-test', ['compile-src'], () => {
  return gulp.src(['./test/**/*.ts'])
    .pipe(tsTestProject(ts.reporter.defaultReporter()))
    .pipe(gulp.dest('./target/test'))
})

// Run test program
gulp.task('test', ['compile-src', 'compile-test'], () => {
  return gulp.src(['./target/test/**/*.js'])
    .pipe(mocha({ repoter: 'list' }))
    .on('error', gutil.log)
})
gulp.task('watch-test', () => gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['test']))

// Create a documentation
gulp.task('docs', () => {
  const packageOption = require('./package.json')
  const configs = {
    target: tsCompilerOptions.target,
    module: tsCompilerOptions.module,
    out: './docs',
    includeDeclarations: true,
    name: packageOption.name,
    version: true
  }
  gulp.src(['./src/**/*.ts'], { read: false })
    .pipe(typedoc(configs))
})

// Browserify this module
gulp.task('browserify', () => {
  browserify({entries: ['browser/index.ts']})
  .plugin(tsify, tsCompilerOptions)
  .bundle()
  .pipe(source('diplomacy.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('browser/'))
})
