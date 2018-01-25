var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var mcss = require('gulp-mcss');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var server = require('gulp-server-livereload');
var rimraf = require('rimraf');
var saveLicense = require('uglify-save-license');

gulp.task('webserver', function () {
	gulp.src('./')
		.pipe(server({
			livereload: {
				enable: true,
				filter: function (filename, cb) {
					cb(!/\.(sa|le)ss$|node_modules|.git/.test(filename));
				}
			},
			defaultFile: "index.html",
			open: true,
			fallback: 'index.html',
			changed: "./css"
		}));
});

gulp.task('devBuild-js', () => {
	return gulp.src(['./js/vendor/*.js', './js/helpers.js', './js/script.js'])
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.on('error', console.log.bind(console))
		.pipe(concat('lib.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build'));
});
gulp.task('prodBuild-js', () => {
	return gulp.src(['./js/vendor/*.js', './js/helpers.js', './js/script.js'])
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.on('error', console.log.bind(console))
		.pipe(concat('lib.js'))
		.pipe(uglify({
			output: {
				comments: saveLicense
			}
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build'));
});

gulp.task('mcss', function () {
	gulp.src(['css/*.css'])
		.pipe(concat('lib.css'))
		.pipe(mcss({
			src: '-debug.css'
		}))
		.pipe(gulp.dest('build/'));
});

gulp.task('mcss-prod', function () {
	gulp.src(['css/*.css'])
		.pipe(concat('lib.css'))
		.pipe(gulp.dest('build/'));
});

gulp.task('watch', function () {
	watch(['js/*.js', './index.html'], batch(function (events, done) {
		gulp.start('devBuild-js', done);
	}));
});

gulp.task('watch-dev', function () {
	watch(['js/*.js', './index.html'], batch(function (events, done) {
		gulp.start('devBuild-js', done);
	}));
});
gulp.task('watch-dev-css', function () {
	watch(['css/*.css'], batch(function (events, done) {
		gulp.start('mcss', done);
	}));
});
gulp.task('rimraf-build', () => {
	return rimraf('build', function () {
		return;
	})
});
gulp.task('build', ['prodBuild-js', 'mcss']);
gulp.task('devBuild', ['devBuild-js', 'mcss', 'watch-dev', 'watch-dev-css', 'webserver']);
gulp.task('default', ['devBuild-js', 'mcss', 'watch-dev', 'watch-dev-css', 'webserver']);
