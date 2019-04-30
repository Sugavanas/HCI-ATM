var gulp = require('gulp'),
    connect = require('gulp-connect');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');

var jsSources = ['./src/**/*.js'],
    tsSources = ['./src/**/*.ts'],
    sassSources = ['./src/css/*.css'],
    htmlSources = ['./src/**/*.html'],
    fontSources = ['./src/webfonts/*'],
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


gulp.task('ts',  done => {
  var val;

  browserify({
    basedir: '.',
    debug: true,
    entries: ['./src/ts/main.ts'],
    cache: {},
    packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("./out/js-compiled/"));
   


  gulp.src(tsSources)
  .pipe(connect.reload());
  done();
});

gulp.task('fonts',  done => {
  gulp.src(fontSources)
  .pipe(gulp.dest("./out/webfonts/"))
  .pipe(connect.reload());
  done();
});


gulp.task('watch',  done => {
  gulp.watch(jsSources, gulp.series('js'));
  gulp.watch(tsSources, gulp.series('ts'));
  gulp.watch(sassSources,  gulp.series('sass'));
  gulp.watch(htmlSources,  gulp.series('html'));
  gulp.watch(fontSources,  gulp.series('fonts'));
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


gulp.task('default', gulp.parallel('html', 'js', 'ts', 'sass', 'connect', 'watch', 'fonts'));