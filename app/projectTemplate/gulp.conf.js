/*global module:false*/
module.exports = function () {
    var client = "./src/";
    var clientApp = client + "app/";
    //   var report = "./report/";
    //   var root = "./";
    var temp = "./.tmp/";
    var dist = "./dist";
    var server = "./webServer/";
    var appModule = clientApp + "app.module.js";
    var jspmNpm = "./jspm_packages/npm/";
    var jspmGithub = "./jspm_packages/github/";
    var translateInitDir = clientApp + "/widgets/translate";


    return {
        appModule: appModule,
        server: server,
        clientApp: clientApp,
        alljs: [
            "./src/**/*.js"
        ],
        dist: dist,
        target: "./target/",
        client: client,
        css: [temp + "styles.css", client + "styles/**/*.css"],
        fonts: [jspmGithub + "twbs/bootstrap@*/fonts/*.{ttf,woff,eof,eot,svg}"],
        depImg: [jspmGithub + "twbs/bootstrap@*/img/*.{jpg,png,gif}"],
        appImg: [client + "img/**/*.*", client + "icones/**/*.*"],
        html: clientApp + "**/*.html",
        htmltemplates: clientApp + "**/*.html",
        images: client + "img/**/*.*",
        index: client + "index.html",
        js: [
            clientApp + "**/*.module.js",
            clientApp + "**/*.js",
            "./mock/**/*.js",
            "!" + clientApp + "**/*.spec.js"
        ],

        langFiles: "src/**/_lang/*.json",
        languages: temp + "/languages",

        //Optimized files
        optimized: {
            app: "app.js",
            templates: "templates.js",
            lib: "lib.js",
            js: "*.js"
        },

        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app',
                standAlone: false,
                root: 'app'
            }
        },
        translateInitDir: translateInitDir,
        translateInitFile: translateInitDir + "/translate.config.js",

        styles: [client + "styles/**/*.less",client + "styles/**/*.css"],

        cordova:"./.cordova",

        //Node Settings
        defaultPort: 7203,
        nodeServer: server + "app.js",
        browserReloadDelay: 1000,
        temp: temp

    };

};
