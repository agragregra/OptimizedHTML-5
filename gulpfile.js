let preprocessor = 'sass', // Preprocessor (sass, less, styl); 'sass' also work with the Scss syntax in blocks/ folder.
    fileswatch   = 'html,htm,txt,json,md,woff2' // List of files extensions for watching & hard reload

import pkg from 'gulp'
const { src, dest, parallel, series, watch } = pkg

import browserSync      from 'browser-sync'
import bssi             from 'browsersync-ssi'
import ssi              from 'ssi'
import webpackStream    from 'webpack-stream'
import webpack          from 'webpack'
import TerserPlugin     from 'terser-webpack-plugin'
import gulpSass         from 'gulp-sass'
import * as dartSass    from 'sass'
const  sass             = gulpSass(dartSass)
import sassglob         from 'gulp-sass-glob'
import less             from 'gulp-less'
import lessglob         from 'gulp-less-glob'
import styl             from 'gulp-stylus'
import stylglob         from 'gulp-noop'
import postCss          from 'gulp-postcss'
import cssnano          from 'cssnano'
import autoprefixer     from 'autoprefixer'
import imagemin         from 'imagemin'
import imageminMozjpeg  from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo     from 'imagemin-svgo'
import path             from 'path'
import fs               from 'fs-extra'
import concat           from 'gulp-concat'
import rsync            from 'gulp-rsync'
import {deleteAsync}    from 'del'

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/',
      middleware: bssi({ baseDir: 'app/', ext: '.html' })
    },
    ghostMode: { clicks: false },
    notify: false,
    online: true,
    // tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
  })
}

function scripts() {
  return src(['app/js/*.js', '!app/js/*.min.js'])
    .pipe(webpackStream({
      mode: 'production',
      performance: { hints: false },
      plugins: [
        new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }), // jQuery (npm i jquery)
      ],
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['babel-plugin-root-import']
              }
            }
          }
        ]
      },
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: { format: { comments: false } },
            extractComments: false
          })
        ]
      },
    }, webpack, (err, stats) => {
      if (err) {
        console.error('❌ Webpack Error:', err);
        this.emit('end');
      }
      if (stats.hasErrors()) {
        console.error('❌ Webpack Stats Errors:', stats.toString({ colors: true }));
        this.emit('end');
      }
    }))
    .on('error', function (err) {
      console.error('❌ Error in Gulp task scripts:', err.message);
      this.emit('end');
    })
    .pipe(concat('app.min.js'))
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function styles() {
  return src([`app/styles/${preprocessor}/*.*`, `!app/styles/${preprocessor}/_*.*`])
    .pipe(eval(`${preprocessor}glob`)())
    .pipe(eval(preprocessor)({
      'include css': true,
      silenceDeprecations: ['legacy-js-api', 'mixed-decls', 'color-functions', 'global-builtin', 'import'],
      loadPaths: ['./']
    })).on('error', function handleError(err) {
      console.error('❌ Preprocessor error:', err.message);
      this.emit('end');
    })
    .pipe(postCss([
      autoprefixer({ grid: 'autoplace' }),
      cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
    ]))
    .pipe(concat('app.min.css'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

async function images() {
  try {
    const files = await imagemin([`app/images/src/**/*`], {
      plugins: [
        imageminMozjpeg({ quality: 90 }),
        imageminPngquant({ quality: [0.6, 0.8] }),
        imageminSvgo()
      ]
    })
    for (const v of files) {
      const relativePath = path.relative('app/images/src', v.sourcePath)
      const destPath = path.join('app/images/dist', relativePath)
      fs.ensureDirSync(path.dirname(destPath))
      fs.writeFileSync(destPath, v.data)
    }
    console.log('✅ Images optimized successfully.')
  } catch (err) {
    console.error('❌ Image Minification Error:', err.message || err)
  }
}

function buildcopy() {
  return src([
    '{app/js,app/css}/*.min.*',
    'app/images/**/*.*',
    '!app/images/src/**/*',
    'app/fonts/**/*'
  ], { base: 'app/', encoding: false })
  .pipe(dest('dist'))
}

async function buildhtml() {
  let includes = new ssi('app/', 'dist/', '/**/*.html')
  includes.compile()
  await deleteAsync('dist/parts', { force: true })
}

async function cleandist() {
  await deleteAsync('dist/**/*', { force: true })
}

function deploy() {
  return src('dist/')
    .pipe(rsync({
      root: 'dist/',
      hostname: 'username@yousite.com',
      destination: 'yousite/public_html/',
      clean: true, // Mirror copy with file deletion
      // include: ['*.htaccess'], // Includes files to deploy
      exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
      recursive: true,
      archive: true,
      silent: false,
      compress: true
    }))
}

function startwatch() {
  watch([`app/styles/${preprocessor}/**/*`], { usePolling: true }, styles)
  watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)
  watch(['app/images/src/**/*'], { usePolling: true }, images)
  watch([`app/**/*.{${fileswatch}}`], { usePolling: true }).on('change', browserSync.reload)
}

export { scripts, styles, images, deploy }
export let assets = series(scripts, styles, images)
export let build = series(cleandist, images, scripts, styles, buildcopy, buildhtml)

export default series(scripts, styles, images, parallel(browsersync, startwatch))
