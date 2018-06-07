"use strict";

var gulp = require('gulp');
var shell = require('gulp-shell');
var gutil = require('gulp-util');
var gulpCopy = require('gulp-copy');
var del = require('del');
var buildFiles = './build/**';
var devDest = '//ba/esefdata/EDIMA/DCE/Apps/DCE-Dashboard/DCE-UI'

gulp.task('default', ['copyBuild'], function() {
    gutil.log('default task executed');
});

gulp.task('runBuild', function () {
    return gulp.src('scripts/build.js')
        .pipe(shell('npm run build'))
        .pipe(gulp.dest('./build'))
})

gulp.task('cleanDevDest', function () {
    return del('/*', {
        root: devDest,
        force: true,
    }).then(console.log).catch(console.error);
});

gulp.task('copyBuild', ['cleanDevDest', 'runBuild'], function () {
    gutil.log(buildFiles);
    gutil.log(devDest);
   return gulp.src(buildFiles)
        .pipe(gulp.dest(devDest));
})

