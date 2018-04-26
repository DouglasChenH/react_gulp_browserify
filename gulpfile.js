var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');

var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');

var path = {
  HTML: 'src/index.html',
  ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/index.html'],
  JS: ['src/js/*.js', 'src/js/**/*.js'],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

//  transforms JSX into JS
gulp.task('transform', function(){
  gulp.src(path.JS)
    .pipe(react())
    .pipe(gulp.dest(path.DEST_SRC));
});

//  take index.html file and copy it over to dist folder 
//  so newly created JS files from transform Gulp task above
//  can be referenced by index.html page
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

/*
 	a task that will always be running 
 	so when we change either index.html or any of the JS files, 
 	other tasks from earlier will run and update the code in the dist folder.
*/
gulp.task('watch', function(){
  gulp.watch(path.ALL, ['transform', 'copy']);
});

gulp.task('webserver',function () {
  gulp.src('src')  // 服务器根目录
  .pipe(webserver({   // 运行webserver
    livereload: true,    // 启用livereload
    open: true  // 服务器启动时自动打开网页
  }));
});


gulp.task('default', ['webserver','watch']);

/*
  grab all of JS files, concatenate all of them together, 
  minify them, then output the result to  dist/build folder. 
*/
gulp.task('build', function(){
  gulp.src(path.JS)
    .pipe(react())
    .pipe(concat(path.MINIFIED_OUT))
    .pipe(uglify(path.MINIFIED_OUT))
    .pipe(gulp.dest(path.DEST_BUILD));
});


/*
  htmlreplace is an object with a key that represents where to replace 
  and whose value is what to replace. 
  That ‘js’ key in htmlreplace coincides with** build:js** in index.html page.
*/
gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});


gulp.task('production', ['replaceHTML', 'build']);