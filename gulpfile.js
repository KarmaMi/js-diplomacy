const gulp = require('gulp')
const gutil = require('gulp-util')
const source = require('vinyl-source-stream')

const ts = require('gulp-typescript')
const typedoc = require('gulp-typedoc')
const sourcemaps = require('gulp-sourcemaps')

const mocha = require('gulp-mocha')

const browserify = require('browserify')

const tsSourceProject = ts.createProject('./configs/tsconfig.json')
const tsTestProject = ts.createProject('./configs/tsconfig.json')

// compile source files
gulp.task('compile-src', () => {
  return gulp.src(['./src/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsSourceProject(ts.reporter.defaultReporter()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./target/src'))
})

// compile test files
gulp.task('compile-test', () => {
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

// Create a documentation
gulp.task('docs', () => {
  const configs = require('./configs/tsconfig.json').compilerOptions
  const packageOption = require('./package.json')
  configs.out = './docs'
  configs.includeDeclarations = true
  configs.name = packageOption.name
  configs.version = true
  gulp.src(['./src/**/*.ts'], { read: false })
    .pipe(typedoc(configs))
})

gulp.task('mocha', () => {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list' }))
    .on('error', gutil.log)
})
gulp.task('watch-mocha', () => gulp.watch(['lib/**', 'test/**'], ['mocha']))

gulp.task('browserify', () => {
  browserify({entries: ['browser/index.js']})
  .bundle()
  .pipe(source('diplomacy.js'))
  .pipe(gulp.dest('browser/'))
})
gulp.task('watch-browserify', () => gulp.watch(['lib/**', 'browser/index.js'], ['browserify']))
