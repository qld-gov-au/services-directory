exports.config = {
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Spec patterns are relative to the location of this config.
    specs: [
        'spec/*_spec.js'
    ],


    multiCapabilities: [
        /*{
            'browserName': 'firefox',
            'platform': 'ANY'
        },
        {
            'browserName': 'chrome',
            'platform': 'ANY'
        },*/
        /*{
            browserName: 'safari',
            'appium-version': '1.0',
            platformName: 'iOS',
            platformVersion: '7.1',
            deviceName: 'iPhone Simulator'
        },*/
        {
            'browserName': 'internet explorer',
            'platform': 'ANY',
            'version': '11',
            'webdriver.ie.driver': './node_modules/protractor/selenium/IEDriverServer.exe'
        },
        {
            'browserName': 'safari',
            'platform': 'Mac'
        }
    ],


    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:8000',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 10000
    }
};
