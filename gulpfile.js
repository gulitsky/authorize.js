var gulp = require('gulp')
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    karma = require('karma').server;

gulp.task('test', function(done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js'
	}, done);
});

gulp.task('dist', function() {
	gulp.src('src/authorize.js')
		.pipe(gulp.dest('dist'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['dist', 'test']);
