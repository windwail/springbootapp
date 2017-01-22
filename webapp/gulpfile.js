var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var es = require('event-stream');
var bowerFiles = require('main-bower-files');
var print = require('gulp-print');
var Q = require('q');
var platform = require('platform');

var fs = require('fs'),
    protractor = require("gulp-protractor").protractor,
    http = require('http'),
    webserver = require('gulp-webserver'),
    KarmaServer = require('karma').Server,
    find = require('gulp-find'),
    gutil = require('gulp-util');

var shell = require('gulp-shell');
var replace = require('gulp-replace');
var rename = require("gulp-rename");
var exec = require('child_process').exec;

var paths = {
    scripts: ['./src/app/**/*.js', '!./src/app/**/*.async.js'],
    styles: './src/**/*.css',
    images: './src/images/**/*',
    index: './src/*.html',
    partials: ['./src/app/**/*.html'],
    distDev: './src/vendor',
    distProd: './prod',
    distSrc: './src',
    distAppSrc: './src/app',
    distScriptsProd: './prod/scripts',
    scriptsDevServer: 'devServer/**/*.js'
};

pipes = {}

pipes.builtVendorScriptsDev = function() {
    return gulp.src(bowerFiles('**/*.js'))
        .pipe(plugins.order(['jquery.js', ]))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtVendorStylesDev = function() {
    return gulp.src(bowerFiles('**/*.css'))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtIndexDev = function() {

    gulp.src(bowerFiles('**/*.js'))

    gulp.src(paths.index)
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(vendorStyles, {relative: true, name: 'bower'}))
        .pipe(gulp.dest(paths.distSrc));
};