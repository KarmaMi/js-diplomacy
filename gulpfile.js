const gulp = require('gulp')
const gutil = require('gulp-util')
const merge = require('merge2')

const ts = require('gulp-typescript')
const typedoc = require('gulp-typedoc')
const sourcemaps = require('gulp-sourcemaps')

const mocha = require('gulp-mocha')

const tsSourceProject = ts.createProject('./src/tsconfig.json')
const tsTestProject = ts.createProject('./test/tsconfig.json')
const tsCompilerOptions = require('./src/tsconfig.json').compilerOptions

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
    includeDeclarations: false,
    name: packageOption.name,
    version: true
  }
  gulp.src(['./src/**/*.ts'], { read: false })
    .pipe(typedoc(configs))
})
