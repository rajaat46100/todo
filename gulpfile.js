var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');

var jsfiles = ['./*.js', './src/*.js'];

gulp.task('style', function () {
    return gulp.src(jsfiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});


gulp.task('inject', function () {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');
    var options = {
        bowerJson: require("./bower.json"),
        directory: "./public/lib"
    }

    var srcFiles = gulp.src(['./public/js/*.js', './public/css/*.css'], { read: false });


    return gulp.src('./src/views/**/*.html')
        .pipe(wiredep(options))
        .pipe(inject(srcFiles))
        .pipe(gulp.dest('./src/views/**/*.html'));
});

gulp.task('auto', ['style'], function () {
    var options = {
        script: "index.js",
        delayTime:1,
        watch: jsfiles
    };

  return nodemon(options).on('restart', function () {
        console.log('Restarting');
    });

});