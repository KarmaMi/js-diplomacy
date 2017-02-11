const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const gutil = require('gulp-util')
const source = require('vinyl-source-stream')
const through = require('through2')

const ts = require('gulp-typescript')
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

        let importText = ''
        let exportText = ''

        const children = fs.readdirSync(file.path, encoding)
        children.forEach(x => {
          if (x === 'module.ts') return

          let moduleName = path.basename(x, '.ts').toString()
          let fileName = path.basename(x, '.ts')

          if (fs.statSync(path.resolve(file.path, x)).isDirectory()) {
            fileName = path.relative(file.path, path.resolve(file.path, x, 'module'))
          } else {
            moduleName = path.basename(x, '.ts').toString()
              .replace(/(^|-)(.)/g, l => l.toUpperCase()).replace(/\W/g, '')
          }

          importText += `import ${moduleName} from "./${fileName}";\n`
          exportText += `  ${moduleName}: ${moduleName},\n`
        })

        const text =
          `${importText}\n` +
          `const module = {\n` +
          `${exportText.substr(0, exportText.length - 2)}\n` +
          `};\n` +
          `export default module;`

        const wStream = fs.createWriteStream(modulePath, { defaultEncoding: encoding })
        wStream.write(text)
        wStream.end()
        callback(null, wStream)
      })
    )
})

// compile source files
gulp.task('compile-src', ['create-module-file'], () => {
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
gulp.task('watch-test', () => gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['test']))

// Create a documentation
gulp.task('docs', ['create-module-file'], () => {
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
