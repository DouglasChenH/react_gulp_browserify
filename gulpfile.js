
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');

var path = {
  HTML: 'src/index.html',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  ENTRY_POINT: './src/js/App.js'
};

//  take index.html file and copy it over to dist folder 
//  so newly created JS files from transform Gulp task above
//  can be referenced by index.html page
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});



gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copy']);  // watch index.html, run copy task if changes

var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC))
      console.log('Updated');
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});



gulp.task('webserver',function () {
  gulp.src(path.DEST)  // 服务器根目录
  .pipe(webserver({   // 运行webserver
    livereload: true,    // 启用livereload
    open: true  // 服务器启动时自动打开网页
  }));
});


gulp.task('default', ['watch']);

/*
  grab all of JS files, concatenate all of them together, 
  minify them, then output the result to  dist/build folder. 
*/
gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify]
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify(path.MINIFIED_OUT)))
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