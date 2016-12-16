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

var linuxPath = './node_modules/protractor/node_modules/webdriver-manager/selenium/';
var winPath = 'node_modules/protractor/node_modules/webdriver-manager/selenium/';
var linuxExec = 'node/node node_modules/protractor/bin/webdriver-manager update --proxy http://172.28.0.66:8080';
var winExec = 'node\\node node_modules\\protractor\\bin\\webdriver-manager update --proxy http://172.28.0.66:8080';

function getDirectoryPath() {
    if(platform.os.family == 'Linux') {
        return linuxPath;
    } else if (platform.os.family == 'Win32') {
        return winPath;
    }
}

function getExecCommand() {
    if(platform.os.family == 'Linux') {
        return linuxExec;
    } else if (platform.os.family == 'Win32') {
        return winExec;
    }
}

// == PATH STRINGS ========

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
var moduleName = "uzedoApp";


// == PIPE SEGMENTS ========

var pipes = {};

pipes.orderedVendorScripts = function() {
    return plugins.order(['jquery.js', 'angular.js']);
};

pipes.orderedAppScripts = function() {
    return plugins.angularFilesort();
};

pipes.minifiedFileName = function() {
    return plugins.rename(function (path) {
        path.extname = '.min' + path.extname;
    });
};

pipes.validatedAppScripts = function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.renameNgModule = function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.ngModuleRenamer({
            newModuleName: moduleName,
            showLogs: false
        }))
        .pipe(gulp.dest(paths.distAppSrc));
};

pipes.builtAppScriptsDev = function() {
    return pipes.validatedAppScripts()
};

pipes.builtAppScriptsProd = function() {
    var scriptedPartials = pipes.scriptedPartials();
    var validatedAppScripts = pipes.validatedAppScripts();

    return es.merge(scriptedPartials, validatedAppScripts)
        .pipe(pipes.orderedAppScripts())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.distScriptsProd));
};

pipes.builtVendorScriptsDev = function() {
    return gulp.src(bowerFiles('**/*.js'))
        .pipe(plugins.order(['jquery.js', 'angular.js', 'angular-translate.js']))
        .pipe(plugins.concat('vendor.js'))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtVendorStylesDev = function() {
    return gulp.src(bowerFiles('**/*.css'))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtVendorScriptsProd = function() {
    return gulp.src(bowerFiles('**/*.js'))
        .pipe(pipes.orderedVendorScripts())
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.distScriptsProd));
};

pipes.validatedDevServerScripts = function() {
    return gulp.src(paths.scriptsDevServer)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.validatedPartials = function() {
    return gulp.src(paths.partials)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter());
};


pipes.builtPartialsDev = function() {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.distDev));
};

pipes.scriptedPartials = function() {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.ngHtml2js({
            moduleName: moduleName
        }));
};

pipes.builtStylesDev = function() {
    return gulp.src(paths.styles);
};

pipes.builtStylesProd = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.cssnano())
        .pipe(plugins.sourcemaps.write())
        .pipe(pipes.minifiedFileName())
        .pipe(gulp.dest(paths.distProd));
};

pipes.processedImagesDev = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distDev + '/images/'));
};

pipes.processedImagesProd = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distProd + '/images/'));
};

pipes.validatedIndex = function() {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtIndexDev = function() {

    var orderedVendorScripts = pipes.builtVendorScriptsDev();

    var orderedAppScripts = pipes.builtAppScriptsDev()
        .pipe(pipes.orderedAppScripts());

    var vendorStyles = pipes.builtVendorStylesDev();
    var appStyles = pipes.builtStylesDev();

    return pipes.validatedIndex()
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppScripts, {relative: true}))
        .pipe(plugins.inject(vendorStyles, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(gulp.dest(paths.distSrc));
};

pipes.builtIndexProd = function() {

    var vendorScripts = pipes.builtVendorScriptsProd();
    var appScripts = pipes.builtAppScriptsProd();
    var appStyles = pipes.builtStylesProd();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distProd)) // write first to get relative path for inject
        .pipe(plugins.inject(vendorScripts, {relative: false, name: 'bower'}))
        .pipe(plugins.inject(appScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(gulp.dest(paths.distProd));
};

pipes.builtAppDev = function() {
    return es.merge(pipes.builtIndexDev(), pipes.renameNgModule());
};

pipes.builtAppProd = function() {
    return es.merge(pipes.builtIndexProd(), pipes.processedImagesProd());
};

// == TASKS ========

// removes all compiled dev files
gulp.task('clean-dev', function() {
    var deferred = Q.defer();
    del(paths.distDev, function() {
        deferred.resolve();
    });
    return deferred.promise;
});

// removes all compiled production files
gulp.task('clean-prod', function() {
    var deferred = Q.defer();
    del(paths.distProd, function() {
        deferred.resolve();
    });
    return deferred.promise;
});


gulp.task('webserver', function () {
    var stream = gulp.src(['./src'])
        .pipe(webserver({
            livereload: false,
            directoryListing: false,
            open: false,
            middleware: function(req, res, next) {
                if (/_kill_\/?/.test(req.url)) {
                    res.end();
                    stream.emit('kill');
                }
                next();
            }
        }));
});

gulp.task('e2e-chrome', ['protractor-chrome'], function (cb) {
    http.request('http://localhost:8000/_kill_').on('close', cb).end();
});

gulp.task('e2e-headless', ['protractor-headless'], function (cb) {
    http.request('http://localhost:8000/_kill_').on('close', cb).end();
});


gulp.task('webdriver-update-if-not-exists', function(done) {
    try {
        var exists = fs.statSync(getDirectoryPath());
    }
    catch(err) {
    }

    if(exists) {
        console.log("Web driver exists. Not downloading.");
        done();
    } else {
        console.log("No web driver. Downloading...");
        var child = exec(getExecCommand());

        child.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
            throw new Error(data);
        });
        child.on('close', function(code) {
            console.log('closing code: ' + code);
            done();
        });
    }

});


gulp.task( 'generate-protractor-config',['webdriver-update-if-not-exists'], function(done) {

    var files = fs.readdirSync(getDirectoryPath());

    if(files && Array.isArray(files)) {
        var driverFile;
        for(var i=0; i<files.length; i++) {
            var f = files[i];
            if(f.match(/zip/g) || f.match(/tar/g) || f.match(/jar/g)) {
                continue;
            }
            if(platform.os.family == 'Linux') {
                if(f.match(/chromedriver.*?/g)) {
                    driverFile = f;
                }
            } else if (platform.os.family == 'Win32') {
                if(f.match(/chromedriver.*?exe/g)) {
                    driverFile = f;
                }
            }
        }
        console.log(driverFile);


        if(platform.os.family == 'Linux') {
            gulp.src(['./test/javascript/protractor.conf.tmp.*'], { base: "./" })
                .pipe(replace(/chromeDriver.*?,/g, "chromeDriver: '"+getDirectoryPath()+driverFile+"',"))
                .pipe(rename(function (path) {
                    path.basename = 'protractor.conf';
                    path.dirname = './';
                }))
                .pipe(gulp.dest("./"));
        } else if (platform.os.family == 'Win32') {
            gulp.src(['./test/javascript/protractor.conf.tmp.*'], {base: "./"})
                .pipe(replace(/chromeDriver.*?,/g, "chromeDriver: '" + getDirectoryPath() + "\\" + driverFile + "',"))
                .pipe(rename(function (path) {
                    path.basename = 'protractor.conf';
                    path.dirname = './';
                }))
                .pipe(gulp.dest("./"));
        }

        done();

    } else {
        throw Error("No dirver files in folder!");
    }

});

gulp.task( 'any',['generate-protractor-config'], function(done){
    console.log("OK, then continue!");
    done();
});

gulp.task('platform', function(done) {
   console.log(platform.os.family);
   done();
});

// Setting up the test task
gulp.task('protractor-chrome', ['generate-protractor-config','webserver'], function(done) {
    var args = ['--baseUrl', 'http://127.0.0.1:8000'];
    gulp.src(["./test/javascript/e2e/*.js"])
        .pipe(protractor({
            configFile: "protractor.conf.js",
            args: args
        }))
        .on('error', function(e) {
            console.log("ERROR!!!");
            //http.request('http://localhost:8000/_kill_').on('close', done).end();
            throw e; })
        .on('end', function(e) {
            console.log("SUCCESS!!!");
            //http.request('http://localhost:8000/_kill_').on('close', done).end();
            done();
        });
});

// Setting up the test task
gulp.task('protractor-headless', ['webserver'], function(done) {
    var args = ['--baseUrl', 'http://127.0.0.1:8000'];

    gulp.src(['./test/javascript/protractor.headless.conf.tmp.js'], { base: "./" })
        .pipe(rename(function (path) {
            path.basename = 'protractor.headless.conf';
            path.dirname = './';
        }))
        .pipe(gulp.dest('./'));

    gulp.src(["./test/javascript/e2e/*.js"])
        .pipe(protractor({
            configFile: "protractor.headless.conf.js",
            args: args
        }))
        .on('error', function(e) {
            console.log("ERROR!!!");
            //http.request('http://localhost:8000/_kill_').on('close', done).end();
            throw e; })
        .on('end', function(e) {
            console.log("SUCCESS!!!");
            //http.request('http://localhost:8000/_kill_').on('close', done).end();
            done();
        });
});

// Наблюдается проблемка с зависанием теста на 30 секундв после выполнения.
// Какие-то баги в карме и socket.io,
gulp.task('karma-test', function (done) {
    return new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();

});


// checks html source files for syntax errors
gulp.task('validate-partials', pipes.validatedPartials);

// checks index.html for syntax errors
gulp.task('validate-index', pipes.validatedIndex);

// moves html source files into the dev environment
gulp.task('build-partials-dev', pipes.builtPartialsDev);

// converts partials to javascript using html2js
gulp.task('convert-partials-to-js', pipes.scriptedPartials);

// runs jshint on the dev server scripts
gulp.task('validate-devserver-scripts', pipes.validatedDevServerScripts);

// runs jshint on the app scripts
gulp.task('validate-app-scripts', pipes.validatedAppScripts);

// moves app scripts into the dev environment
gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);

// concatenates, uglifies, and moves app scripts and partials into the prod environment
gulp.task('build-app-scripts-prod', pipes.builtAppScriptsProd);

// compiles app sass and moves to the dev environment
gulp.task('build-styles-dev', pipes.builtStylesDev);

// compiles and minifies app sass to css and moves to the prod environment
gulp.task('build-styles-prod', pipes.builtStylesProd);

// moves vendor scripts into the dev environment
gulp.task('build-vendor-scripts-dev', pipes.builtVendorScriptsDev);

// concatenates, uglifies, and moves vendor scripts into the prod environment
gulp.task('build-vendor-scripts-prod', pipes.builtVendorScriptsProd);

// validates and injects sources into index.html and moves it to the dev environment
gulp.task('build-index-dev', pipes.builtIndexDev);

// validates and injects sources into index.html, minifies and moves it to the dev environment
gulp.task('build-index-prod', pipes.builtIndexProd);

// builds a complete dev environment
gulp.task('build-app-dev', pipes.builtAppDev);

// builds a complete prod environment
gulp.task('build-app-prod', pipes.builtAppProd);

// cleans and builds a complete dev environment
gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);

// cleans and builds a complete prod environment
gulp.task('clean-build-app-prod', ['clean-prod'], pipes.builtAppProd);



// default task builds for prod
gulp.task('default', ['clean-build-app-dev']);

// Web unit and end-to-end test
gulp.task('test', ['webserver-stop']);


