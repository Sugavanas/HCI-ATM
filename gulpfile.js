var gulp = require('gulp'),
    connect = require('gulp-connect');

var jsSources = ['./src/**/*.js'],
    sassSources = ['./src/css/*.css'],
    htmlSources = ['./src/**/*.html'],
    outputJSDir = './out/',
    outputCSSDir = './out/css',
    outputHTMLDir = './out/';

gulp.task('sass',  done => {
  gulp.src(sassSources)
  .pipe(gulp.dest(outputCSSDir))
  .pipe(connect.reload());
  done();
});

gulp.task('js',  done => {
  gulp.src(jsSources)
  .pipe(gulp.dest(outputJSDir))
  .pipe(connect.reload());
  done();
});

gulp.task('watch',  done => {
  gulp.watch(jsSources, gulp.series('js'));
  gulp.watch(sassSources,  gulp.series('sass'));
  gulp.watch(htmlSources,  gulp.series('html'));
  done();
});

gulp.task('connect', done => {
  connect.server({
    root: './out/',
    livereload: true
  });
  done();
});

gulp.task('html', done => {
  gulp.src(htmlSources)
  .pipe(gulp.dest(outputHTMLDir))
  .pipe(connect.reload());
   done();
});

gulp.task('default', gulp.parallel('html', 'js', 'sass', 'connect', 'watch'));