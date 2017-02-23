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

const tsSourceProject = ts.createProject('./configs/tsconfig.json')
const tsTestProject = ts.createProject('./configs/tsconfig.json')

gulp.task('create-module-file', () => {
  return gulp.src(['./src/**'])
    .pipe(
      through.obj((file, encoding, callback) => {
        if (!file.path) {
          callback()
          return
        }

        // It file is not directory, do nothing
        if (!fs.statSync(file.path).isDirectory()) {
          callback()
          return
        }

        const modulePath = path.resolve(file.path, 'module.ts')

        let text = ''

        const children = fs.readdirSync(file.path, encoding)
        children.forEach(x => {
          if (x === 'module.ts') return

          let fileName = path.basename(x, '.ts')

          if (fs.statSync(path.resolve(file.path, x)).isDirectory()) {
            fileName = path.relative(file.path, path.resolve(file.path, x, 'module'))
            text += `import * as _${x} from "./${fileName}"\n`
            text += `export const ${x} = _${x}\n`
          } else {
            text += `export * from "./${fileName}"\n`
          }
        })

        const wStream = fs.createWriteStream(modulePath, { defaultEncoding: encoding })
        wStream.write(text)
        wStream.end()
        callback(null, wStream)
      })
    )
})

// compile source files
gulp.task('compile-src', ['create-module-file'], () => {
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
gulp.task('docs', ['create-module-file'], () => {
  const tsconfigs = require('./configs/tsconfig.json').compilerOptions
  const packageOption = require('./package.json')
  const configs = {
    target: tsconfigs.target,
    module: tsconfigs.module,
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
  const tsconfigs = require('./configs/tsconfig.json').compilerOptions
  browserify({entries: ['browser/index.ts']})
  .plugin(tsify, tsconfigs)
  .bundle()
  .pipe(source('diplomacy.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('browser/'))
})
