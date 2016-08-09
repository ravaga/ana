'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
 
gulp.task('sass', function () {
  return gulp.src('./dev/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/assets'))
    .pipe(livereload({ start: true }));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./dev/**/*.scss', ['sass']);
});