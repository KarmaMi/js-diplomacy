const gulp = require('gulp')
const ts = require('gulp-typescript')
const mocha = require('gulp-mocha')
const gutil = require('gulp-util')
const browserify = require('browserify')
const source = require('vinyl-source-stream')

const tsSourceProject = ts.createProject('./configs/tsconfig.json')
const tsTestProject = ts.createProject('./configs/tsconfig.json')

// compile source files
gulp.task('compile-src', () => {
  return gulp.src(['./src/**/*.ts'])
    .pipe(tsSourceProject(ts.reporter.defaultReporter()))
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

gulp.task('docs', (cb) => {
  const configs = require('./configs/jsdoc-config.json')
  gulp.src(['./lib/**/*.js', 'README.md'], { read: false })
    .pipe(jsdoc(configs, cb))
})
