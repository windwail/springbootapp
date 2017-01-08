
exports.config = {
    /**
     *  Uncomment ONE of the following to connect to: seleniumServerJar OR directConnect. Protractor
     *  will auto-start selenium if you uncomment the jar, or connect directly to chrome/firefox
     *  if you uncomment directConnect.
     */
    //replace('@@apiUrl', settings.apiUrl): "node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.3.jar",

    chromeDriver: 'replace this',

    directConnect: true,

    chromeOnly: true,

    specs: ['test/e2e/*.js'],
    framework: 'jasmine2',

    capabilities: {
        browserName: 'chrome'
    },

    // Options to be passed to Jasmine-node.
    onPrepare: function () {

        browser.someShit = 'shit';


    }
};
