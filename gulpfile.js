'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var util = require('gulp-util');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var bowerFiles = require('bower-files')();

/*
| SASS COMPILER
*/

// sass dev path
var config = {
    assetsDir: 'dev/',
    dependenciesDir:'bower_components',
    sassPattern: 'sass/**/*.scss',
    jsPattern: 'js/**/*.js',
    production: !!util.env.production
};

gulp.task('sass', function() {
    gulp.src(config.assetsDir+'/'+config.sassPattern)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(config.production ? minifyCSS() : util.noop())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/css'));
});


/*
| JS COMPILER AND MINIFIER
*/

//script dev paths
gulp.task('scripts', function(){
    gulp.src(config.assetsDir+'/'+config.jsPattern)
    .pipe(concat('scripts.js'))
    .pipe(config.production ? uglify() : util.noop())
    .pipe(gulp.dest('dist/assets/js'));
    
});


//bower dev paths
gulp.task('bower', function() {    
   gulp.src(bowerFiles.ext('js').files)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'));
});


gulp.task('watch', function() {
    gulp.watch(config.assetsDir+'/'+config.sassPattern, ['sass'])
    
    gulp.watch(config.assetsDir+'/'+config.jsPattern, ['scripts'])
    
});

gulp.task('default', ['sass', 'scripts']);
