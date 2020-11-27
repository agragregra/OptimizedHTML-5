let fileswatch = 'html,htm,txt,json,md,woff2' // List of files extensions for watching & hard reload

const { src, dest, parallel, series, watch } = require('gulp')
const browserSync  = require('browser-sync').create()
const webpack      = require('webpack-stream')
const sass         = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const rename       = require('gulp-rename')
const imagemin     = require('gulp-imagemin')
const newer        = require('gulp-newer')
const rsync        = require('gulp-rsync')
const del          = require('del')

function browsersync() {
	browserSync.init({
		server: { baseDir: 'app/' },
		notify: false,
		online: true
	})
}

function scripts() {
	return src('app/js/app.js')
	.pipe(webpack({
		mode: 'production',
		module: {
			rules: [
				{
					test: /\.(js)$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
					query: {
						presets: ['@babel/env']
					}
				}
			]
		}
	})).on('error', function handleError() {
		this.emit('end')
	})
	.pipe(rename('app.min.js'))
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

function styles() {
	return src('app/sass/main.sass')
	.pipe(sass({ outputStyle: 'compressed' }))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(rename('app.min.css'))
	.pipe(dest('app/css'))
	.pipe(browserSync.stream())
}

function images() {
	return src('app/img/src/**/*')
	.pipe(newer('app/img/dest'))
	.pipe(imagemin())
	.pipe(dest('app/img/dest'))
}

function cleanimg() {
	return del('app/img/dest/**/*', { force: true })
}

function deploy() {
	return src('app/')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		include: [/* '*.htaccess' */], // Included files to deploy,
		exclude: [ '**/Thumbs.db', '**/*.DS_Store' ],
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
}

function startwatch() {
	watch('app/sass/**/*', { usePolling: true }, styles)
	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)
	watch('app/img/src/**/*.{jpg,jpeg,png,webp,svg,gif}', { usePolling: true }, images)
	watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
}

exports.assets   = series(cleanimg, scripts, images)
exports.scripts  = scripts
exports.styles   = styles
exports.images   = images
exports.cleanimg = cleanimg
exports.deploy   = deploy
exports.default  = series(scripts, images, styles, parallel(browsersync, startwatch))
