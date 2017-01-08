exports.config = {
    // if using seleniumServerJar, do not specify seleniumAddress !!!
    seleniumServerJar: './node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-2.52.0.jar',
    //port of the server

    seleniumArgs: ['-browserTimeout=30'],
    //seleniumAddress: 'http://localhost:4444/wd/hub',
    framework: 'jasmine',
    troubleshoot: false, //true if you want to see actual web-driver configuration
    capabilities: {
        'browserName': 'phantomjs',
        //Can be used to specify the phantomjs binary path.
        //This can generally be ommitted if you installed phantomjs globally.
        //'phantomjs.binary.path': require('phantomjs').path,
        'phantomjs.binary.path': require('phantomjs-prebuilt').path,
        'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false'],
        'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
    },

    specs: ['test/javascript/e2e/*.js'], //path to the test specs
    //specs: ['test/e2e/**/*.js'], //path to the test specs
    allScriptsTimeout: 11000,
    getPageTimeout: 11000,


    // Options to be passed to Jasmine-node.
    onPrepare: function () {
        // The require statement must be down here, since jasmine-reporters@1.0
        // needs jasmine to be in the global and protractor does not guarantee
        // this until inside the onPrepare function.
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(
            new jasmineReporters.JUnitXmlReporter('xmloutput', true, true)
        );
    }


};
