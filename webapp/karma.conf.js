// Karma configuration
// Generated on Mon Dec 05 2016 16:14:20 GMT+0300 (MSK)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        './src/vendor/vendor.js',
        './src/app/app.module.js',
        './src/app/layouts/navbar/navbar.controller.js',
        './src/app/entities/content/content.service.js',
        './src/app/entities/doc/doc.state.js',
        './src/app/entities/doc/doc.service.js',
        './src/app/entities/doc/doc.controller.js',
        './src/app/entities/doc/doc-list.state.js',
        './src/app/entities/doc/doc-list.controller.js',
        './src/app/entities/user/user.service.js',
        './src/app/entities/operator/operator.service.js',
        './src/app/components/alert/alert.service.js',
        './src/app/components/alert/alert.component.js',
        './src/app/components/alert/alert-error.component.js',
        './src/app/settings/settings.state.js',
        './src/app/settings/settings.service.js',
        './src/app/settings/settings.controller.js',
        './src/app/home/home.state.js',
        './src/app/home/home.controller.js',
        './src/app/services/operator-auth.service.js',
        './src/app/interceptors/notification.interceptor.js',
        './src/app/interceptors/errorhandler.interceptor.js',
        './src/app/csp/csp.service.js',
        './src/app/csp/csp.plugin.service.js',
        './src/app/csp/cert-dialog.controller.js',
        './src/app/config/uib-pagination.config.js',
        './src/app/config/translation.config.js',
        './src/app/config/http.config.js',
        './src/app/config/compile.config.js',
        './src/app/app.state.js',
        './src/app/app.constants.js',

        './test/javascript/jasmine/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      './src/app/**/*.async.js',
        './src/test/javascript/e2e/**/*.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    specReporter: {
      maxLogLines: 5,         // limit number of lines logged per test
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      showSpecTiming: false // print the time elapsed for each spec
    },

      plugins : [
          'karma-jasmine',
          'karma-chrome-launcher',
          'karma-phantomjs-launcher',
          'karma-spec-reporter'
      ]
  })
}
