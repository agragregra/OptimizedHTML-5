// VARIABLES & PATHS

let preprocessor = 'sass', // Preprocessor (sass, scss, less, styl)
		fileswatch   = 'html,htm,txt,json,md,woff2', // List of files extensions for watching & hard reload (comma separated)
		imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
		baseDir      = 'app', // Base dir path without «/» at the end
		online       = true; // If «false» - Browsersync will work offline without internet connection

let path = {

	src: {
		styles: baseDir + '/' + preprocessor + '/main.*',
		images: baseDir + '/images/src/**/*',
		scripts: [
			// 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
			baseDir + '/js/app.js' // app.js. Always at the end
		]
	},

	dest: {
		styles:  baseDir + '/css',
		images:  baseDir + '/images/dest',
		scripts: baseDir + '/js',
	},

	deploy: {
		hostname:    'username@yousite.com', // Deploy hostname
		destination: 'yousite/public_html/', // Deploy destination
		include:     [/* '*.htaccess' */], // Included files to deploy
		exclude:     [ '**/Thumbs.db', '**/*.DS_Store' ], // Excluded files from deploy
	},

	cssOutputName: 'app.min.css',
	jsOutputName:  'app.min.js',

}

// LOGIC

const { src, dest, parallel, series, watch } = require('gulp');
const sass         = require('gulp-sass');
const scss         = require('gulp-sass');
const less         = require('gulp-less');
const styl         = require('gulp-stylus');
const cleancss     = require('gulp-clean-css');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const rsync        = require('gulp-rsync');
const del          = require('del');

function browsersync() {
	browserSync.init({
		server: { baseDir: baseDir + '/' },
		notify: false,
		online: online
	})
}

function styles() {
	return src(path.src.styles)
	.pipe(eval(preprocessor)())
	.pipe(concat(path.cssOutputName))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(dest(path.dest.styles))
	.pipe(browserSync.stream())
}

function scripts() {
	return src(path.src.scripts)
	.pipe(concat(path.jsOutputName))
	.pipe(uglify())
	.pipe(dest(path.dest.scripts))
	.pipe(browserSync.stream())
}

function images() {
	return src(path.src.images)
	.pipe(newer(path.dest.images))
	.pipe(imagemin())
	.pipe(dest(path.dest.images))
}

function cleanimg() {
	return del('' + path.dest.images + '/**/*', { force: true })
}

function deploy() {
	return src(baseDir + '/')
	.pipe(rsync({
		root: baseDir + '/',
		hostname: path.deploy.hostname,
		destination: path.deploy.destination,
		include: path.deploy.include,
		exclude: path.deploy.exclude,
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
}

function startwatch() {
	watch(baseDir + '/' + preprocessor + '/**/*', styles);
	watch(baseDir + '/**/*.{' + imageswatch + '}', images);
	watch(baseDir + '/**/*.{' + fileswatch + '}').on('change', browserSync.reload);
	watch([baseDir + '/**/*.js', '!' + path.dest.scripts + '/*.min.js'], scripts);
}

exports.browsersync = browsersync;
exports.assets      = series(cleanimg, styles, scripts, images);
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.deploy      = deploy;
exports.default     = parallel(images, styles, scripts, browsersync, startwatch);
