'use strict'

const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const webpack = require('webpack-stream')
const webserver = require('gulp-webserver')

const __build = path.resolve(__dirname, 'build')
const __app = path.resolve(__dirname, 'src/client')
const __server = path.resolve(__dirname, 'src/server')

let nodeModules = {}

fs.readdirSync('node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod
  })

gulp.task('css', () => {
  gulp.src(__app + '/css/**/*.scss')
    .pipe(concat('style.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(__build))
})

gulp.task('webserver', () => {
  gulp.src(__build)
    .pipe(webserver({
      fallback: 'index.html',
      // port: 8001,
      host: '0.0.0.0',
      livereload: false,
      directoryListing: false,
      open: false,
      proxies: [{
        source: '/updates',
        target: 'http://0.0.0.0:8080/updates'
      }]
    }))
})

gulp.task('transpile', () => {
  gulp.src(__app + '/js/client.js')
    .pipe(webpack({
      name: 'client',
      target: 'web',
      output: {
        path: __build,
        filename: 'client.js'
      },
      module: {
        loaders: [{
          test: /\.jsx?/,
          include: __app,
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: ['transform-runtime']
          }
        }]
      }
    }))
    .pipe(gulp.dest(__build))

  gulp.src(__server + '/server.js')
    .pipe(webpack({
      name: 'server',
      target: 'node',
      externals: nodeModules,
      output: {
        path: __build,
        filename: 'server.js'
      },
      module: {
        loaders: [{
          test: /\.jsx?/,
          include: __server,
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0'],
            plugins: ['transform-runtime']
          }
        }]
      }
    }))
    .pipe(gulp.dest(__build))
})

gulp.task('move', () => {
  gulp.src([__app + '/*.html']).pipe(gulp.dest(__build))
  gulp.src([__app + '/img/*']).pipe(gulp.dest(__build + '/img'))
})

gulp.task('serve', ['webserver'])

gulp.task('build', ['css', 'transpile', 'move'])

gulp.task('default', ['build', 'webserver'], () => {
  gulp.watch(__app + '/*.html', ['move'])
  gulp.watch(__app + '/css/**/*.scss', ['css'])
  gulp.watch(__app + '/js/**/*.js', ['transpile'])
  gulp.watch(__server + '/**/*.js', ['transpile'])
})
