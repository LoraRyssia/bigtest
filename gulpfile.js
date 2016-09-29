var gulp         = require('gulp'),

		jade         = require('gulp-jade'),

	  sass         = require('gulp-sass'),
		sourcemaps    = require('gulp-sourcemaps'),
		postcss      = require('gulp-postcss'),
		mqpacker     = require('css-mqpacker'),

  	browserSync  = require('browser-sync').create(),
	  del          = require('del'),
	  autoprefixer = require('autoprefixer'),
 	  imagemin     = require('gulp-imagemin'),
		runSequence = require('run-sequence');

/*===================JADE==================*/

gulp.task('jade', function() {
	gulp.src('src/*.jade')
		.pipe(jade({
      pretty: true
    }))
		.pipe(gulp.dest('dist/'))
});

gulp.task('jade:watch', function() {
  gulp.watch('src/**/*.jade', ['jade']);
});


/*=====================SASS==================*/

var processors = [
  autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
  }),
  mqpacker({
      sort: sortMediaQueries
  })
];

gulp.task('sass', function() {
  return gulp
    .src('src/assets/style.sass')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('sass:watch', function() {
  gulp.watch('src/**/*.sass', ['sass']);
});

function isMax(mq) {
  return /max-width/.test(mq);
}

function isMin(mq) {
	return /min-width/.test(mq);
}

function sortMediaQueries(a, b) {
  A = a.replace(/\D/g, '');
  B = b.replace(/\D/g, '');

  if (isMax(a) && isMax(b)) {
    return B - A;
  } else if (isMin(a) && isMin(b)) {
    return A - B;
  } else if (isMax(a) && isMin(b)) {
    return 1;
  } else if (isMin(a) && isMax(b)) {
    return -1;
  }

  return 1;
}

/*======================SERVER=====================*/

gulp.task('server', function() {
    server.init({
        server: {
            baseDir: 'dist/',
            directory: false
        },
        files: [
            'dist/*.html',
            'dist/css/*.css',
            'dist/img/**/*'
        ]
    });
});

/*====================IMGMIN=========================*/

gulp.task('imagemin', function() {
	gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

/*====================CLEAN=========================*/

gulp.task('clean', function() {
	return del.sync('dist');
});

/*====================COPY=========================*/

gulp.task('copy:fonts', function() {
  return gulp
    .src('src/fonts/*.{ttf,eot,woff,woff2,otf}')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy:js', function() {
  return gulp
    .src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy:lib', function() {
  return gulp
    .src('src/vendor/**/*.*')
    .pipe(gulp.dest('dist/libs'));
});

gulp.task('copy:img', function() {
  return gulp
  	.src('src/img/**/*.{jpg,png,jpeg,svg,gif}')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('copy', [
    'copy:img',
    'copy:lib',
    'copy:fonts',
    'copy:js'
]);

gulp.task('copy:watch', function() {
    gulp.watch('src/img/*', ['copy']);
    gulp.watch('src/vendor/*', ['copy']);
    gulp.watch('src/js/*', ['copy']);
});

gulp.task('watch',
    ['copy:watch',
    'jade:watch',
    'sass:watch'
]);


gulp.task('build', function() {
	runSequence(
			'clean',
			'sass',
			'jade',
			'copy',
			'imagemin'
	);
});
