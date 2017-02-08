const gulp = require('gulp')
const mocha = require('gulp-mocha')
const gutil = require('gulp-util')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const jsdoc = require('gulp-jsdoc3')

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
