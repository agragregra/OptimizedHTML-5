// VARIABLES & PATHS

let preprocessor = 'sass', // Preprocessor (sass, scss, less, styl)
		fileswatch   = 'html,htm,txt,json,md,woff2', // List of files extensions for watching & hard reload (comma separated)
		imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
		baseDir      = 'app', // Base directory path without «/» at the end
		online       = true; // If «false» - Browsersync will work offline without internet connection

let paths = {

	plugins: {
		src: [
			// 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
		]
	},

	userscripts: {
		src: [
			baseDir + '/js/app.js' // app.js. Always at the end
		]
	},

	styles: {
		src:  baseDir + '/' + preprocessor + '/main.*',
		dest: baseDir + '/css',
	},

	images: {
		src:  baseDir + '/images/src/**/*',
		dest: baseDir + '/images/dest',
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
const babel        = require('gulp-babel');
const uglify       = require('gulp-uglify');
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

function plugins() {
	if (paths.plugins.src != '') {
		return src(paths.plugins.src)
		.pipe(concat('plugins.tmp.js'))
		.pipe(dest(baseDir + '/js/_tmp'))
	} else {
		async function createFile() {
			require('fs').writeFileSync(baseDir + '/js/_tmp/plugins.tmp.js', '');
		}; return createFile();
	}
}

function userscripts() {
	return src(paths.userscripts.src)
	.pipe(babel({ presets: ['@babel/env'] }))
	.pipe(concat('userscripts.tmp.js'))
	.pipe(dest(baseDir + '/js/_tmp'))
}

function scripts() {
	return src([
		baseDir + '/js/_tmp/plugins.tmp.js',
		baseDir + '/js/_tmp/userscripts.tmp.js'
	])
	.pipe(concat(paths.jsOutputName))
	.pipe(uglify())
	.pipe(dest(baseDir + '/js'))
}

function styles() {
	return src(paths.styles.src)
	.pipe(eval(preprocessor)())
	.pipe(concat(paths.cssOutputName))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleancss({ level: { 1: { specialComments: 0 } },/* format: 'beautify' */ }))
	.pipe(dest(paths.styles.dest))
	.pipe(browserSync.stream())
}

function images() {
	return src(paths.images.src)
	.pipe(newer(paths.images.dest))
	.pipe(imagemin())
	.pipe(dest(paths.images.dest))
}

function cleanimg() {
	return del('' + paths.images.dest + '/**/*', { force: true })
}

function deploy() {
	return src(baseDir + '/')
	.pipe(rsync({
		root: baseDir + '/',
		hostname: paths.deploy.hostname,
		destination: paths.deploy.destination,
		include: paths.deploy.include,
		exclude: paths.deploy.exclude,
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
}

function startwatch() {
	watch(baseDir  + '/' + preprocessor + '/**/*', {usePolling: true}, styles);
	watch(baseDir  + '/images/src/**/*.{' + imageswatch + '}', {usePolling: true}, images);
	watch(baseDir  + '/**/*.{' + fileswatch + '}', {usePolling: true}).on('change', browserSync.reload);
	watch([baseDir + '/js/**/*.js', '!' + baseDir + '/js/**/*.min.js', '!' + baseDir + '/js/**/*.tmp.js'], {usePolling: true}, series(plugins, userscripts, scripts)).on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.scripts     = series(plugins, userscripts, scripts);
exports.assets      = series(cleanimg, styles, plugins, userscripts, scripts, images);
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.deploy      = deploy;
exports.default     = series(plugins, userscripts, scripts, images, styles, parallel(browsersync, startwatch));
