exports.config = {
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar',

  capabilities: { 'browserName': 'chrome' },

  baseUrl: 'http://localhost:7230/',

  specs: ['../e2e/*.e2e.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
