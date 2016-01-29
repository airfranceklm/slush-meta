/*globals require : false, setTimeout: false, process: false*/
(function() {

    var gulp = require('gulp-help')(require("gulp"), {
        aliases: ['-h', 'h', '?'],
        hideEmpty: true,
        hideDepsMessage: true
    });
    var args = require("yargs").argv;
    var browserSync = require("browser-sync");
    var $ = require("gulp-load-plugins")({lazy: true});
    var data = require("gulp-data");
    var path = require("path");
    var config = require("./gulp.conf")();
    var port = process.env.PORT || config.defaultPort;
    var del = require("del");
    var protractor = require("gulp-protractor").protractor;
    var Karma = require('karma').Server;
    // Download and update the selenium driver
    var webdriver_update = require('gulp-protractor').webdriver_update;
    var fs = require("fs");
    var stripComments = require('strip-json-comments');

    /**
     * Default task is binded to help task.
     */
    gulp.task("default", false,['help']);

    /**
     * Serves the dev application (no concat or minification)
     */
    gulp.task("serve-dev", "Serves the application in dev mode (no concat or minification)", ["analyse", "lessCompile", "i18n"], function () {
        serve("dev");
        log("serving dev");
    },  {
        options: {
            'mock': 'Starts the server with mocked data'
        }
    });

    /**
     * Builds and serves the target application
     */
    gulp.task("serve-build", "Builds and serves the live ready application (concat and minification)", ["optimize"], function () {
        serve("build");
        log("serving build");
    },  {
        options: {
            'mock': 'Starts the server with mocked data',
            'pretty': 'Will generate the js application as human readable code'
        }
    });

    /**
     * Analyses the source for code syntax and style.
     */
    gulp.task("analyse", "Analyses the source for code syntax and style.", function () {
        log("Anylizing source");

        return gulp
            .src(config.alljs)
            .pipe($.eslint())
            .pipe($.eslint.formatEach())
            .pipe($.eslint.failOnError());

    });

    /**
     * Analyses the source for code syntax and style on the fly, and reload the browser if there was no error.
     * This is an internal task, do not use it directly
     */
    gulp.task("jsHotReload", function () {
        var error = false;
        return gulp
            .src(config.alljs)
            .pipe($.plumber({
                errorHandler: function(err) {
                    browserSync.notify("<span style='color:red;font-size:1.2em'>An error occur please check the log for more details </span><br/>" +err.fileName+", on line "+err.lineNumber,5000);
                    error = true;
                    this.end();
                    this.emit('end');
                }
            }))
            .pipe($.eslint())
            .pipe($.eslint.formatEach())
            .pipe($.eslint.failOnError())
            .on("end", function(){
                if(!error){
                    browserSync.reload();
                }
            });

    });

    /**
     * Cleans up the folders created by the different build tasks
     */
    gulp.task("clean", "Cleans up the folders created by the different build tasks", function (done) {
        var delConfig = [].concat(config.target, config.temp, config.dist, config.cordova);
        log("Cleaning: " + $.util.colors.blue(delConfig));
        del(delConfig, done);
    });

    /**
     * bundles the application into one file and transplile it to ES5
     * This is an internal task, do not use it directly
     */
    gulp.task("bundle", [ "clean", "templatecache"], function (done) {

        gulp.src([config.appModule])
            .pipe(gulp.dest(config.temp));

        gulp.src([config.appModule, config.temp + config.optimized.templates])
            .pipe($.concat(config.appModule))
            .pipe(gulp.dest("."));

        var Builder = require("systemjs-builder");
        var builder = new Builder();
        var bootFilePath = "src/app/boot";
        if (args.mock !== undefined) {
            bootFilePath = "mock/bootBundle";
        }

        builder.loadConfig("./jspm.conf.js")
            .then(function() {
                builder.buildSFX(bootFilePath, config.temp + config.optimized.app, { sourceMaps: false, config: {sourceRoot: config.temp} })
                    .then(function() {
                        gulp.src([config.temp + "app.module.js"])
                            .pipe(gulp.dest(config.clientApp));
                        return done();
                    })
                    .catch(function(ex) {
                        gulp.src([config.temp + "app.module.js"])
                            .pipe(gulp.dest(config.clientApp));
                        done(new Error(ex));
                    });
            });
    });

    /**
     * Compile the less files in a local.css file
     * This is an internal task, do not use it directly
     */
    gulp.task("lessCompile", function () {

        return gulp.src(config.styles)
            .pipe($.less())
            .pipe($.concat("app.css"))
            .pipe(gulp.dest("./.tmp/css"));
    });

    /**
     * Copies the fonts into the target folder.
     * This is an internal task, do not use it directly
     */
    gulp.task("copyfonts", ["clean"], function() {
        return gulp.src(config.fonts)
            .pipe($.copy("./target/", {prefix: 0}));
    });

    /**
     * Copies the images into the target folder.
     * This is an internal task, do not use it directly
     */
    gulp.task("copyImg", ["clean"],function(done) {
        var cpt = 0;

        gulp.src(config.depImg)
            .pipe($.copy("./target/", {prefix: 0}))
            .on("end", function(){
                cpt++;
                if(cpt === 2){
                    done();
                }
            });

        gulp.src(config.appImg)
            .pipe($.copy("./target/", {prefix: 1}))
            .on("end", function(){
                cpt++;
                if(cpt === 2){
                    done();
                }
            });
    });

    /**
     * Copies the languages files into the target folder.
     * This is an internal task, do not use it directly
     */
    gulp.task("copyLang", ["clean", "i18n"],function() {

        return gulp.src(config.languages + "/*.json")
            .pipe(gulp.dest("./target/languages/"));

    });

    /**
     * Generates angular template cache from all the HTML files in the project.
     * This is an internal task, do not use it directly
     */
    gulp.task('templatecache', ["clean"], function () {
        log('Creating AngularJS $templateCache');
        return gulp
            .src(config.htmltemplates)
            .pipe($.minifyHtml({empty: true}))
            .pipe($.angularTemplatecache(
                config.templateCache.file,
                config.templateCache.options
            ))
            .pipe(gulp.dest(config.temp));
    });

    /**
     * Creates the languages files gathering all languages json files in the app.
     */
    gulp.task('i18n', 'Creates the languages files gathering all languages json files in the app.', function (done) {
        log('Creating languages files');
        var langs = {};
        var nbFilesDone = 0;
        var nbLocales = 0;
        gulp
            .src(config.langFiles)
            .pipe(data(function( file ){
                var lang = path.basename(file.path,".json");
                var content = JSON.parse(stripComments(String(file._contents)));

                var messages = langs[lang];
                if(messages === undefined){
                    messages = {}
                    langs[lang] = messages;
                    nbLocales ++;
                }

                for(var key in content){
                    messages[key] = content[key];
                }

            }))
            .resume()
            .on("end", function(){
                var txt= "let languages = [";

                for(var key in langs){
                    txt += "\"" + key + "\", ";
                }
                txt = txt.substring(0, txt.length - 2);
                txt += "];"
                log(txt);
                gulp.src(config.translateInitFile)
                    .pipe($.debug())
                    .pipe($.replace(/\/\* LANGUAGES_PARAMS \*\/\n[^\n]*\n[\t ]*\/\* LANGUAGES_PARAMS-END \*\//,
                        "/* LANGUAGES_PARAMS */\n        " + txt + "\n        /* LANGUAGES_PARAMS-END */"))
                    .pipe(gulp.dest(config.translateInitDir))
                    .on("end",function(){
                        //log("done file");

                        for(var key in langs){
                            var content = args.pretty?JSON.stringify(langs[key], null, 2):JSON.stringify(langs[key]);

                            $.file("app." + key + ".json", content, {src: true})
                                .pipe(gulp.dest(config.languages))
                                .on("end", function() {
                                    nbFilesDone ++;
                                    if (nbLocales === nbFilesDone){
                                        done();
                                    }
                                });
                        }
                    });

            });
    }, {
        options: {
            "pretty": "Makes the generated language file readable for a human being."
        }
    });


    /**
     * Optimizes the application in the target folder.
     */
    gulp.task("optimize", "Optimizes the application in the target folder.", ["clean", "bundle", "copyfonts", "copyImg", "lessCompile", "copyLang"], function () {
        log("Optimizing the javascript, css, html");

        var bundle = config.temp + config.optimized.app;
        var templates = config.temp + config.optimized.templates;
        var assets = $.useref.assets({searchPath: "./"});
        var cssFilter = $.filter("**/*.css");
        var jsAppFilter = $.filter("**/" + config.optimized.app);
        log(config.temp + "app.css");

        var doUglify = !args.pretty;

        return gulp
            .src(config.index)
            .pipe($.inject(gulp.src([config.temp + "app.css"])))
            .pipe($.inject(gulp.src([bundle, templates])))
            .pipe(assets)
            .pipe($.debug({title: "assets:"}))
            .pipe($.debug({title: "css:"}))
            .pipe(cssFilter)
            .pipe($.csso())
            .pipe(cssFilter.restore())
            .pipe(jsAppFilter)
            .pipe($.debug({title: "js app:"}))
            .pipe($.ngAnnotate())
            .pipe($.if(doUglify, $.uglify()))
            .pipe(jsAppFilter.restore())
            .pipe($.rev())
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe($.revReplace())
            .pipe(gulp.dest(config.target));


    },  {
        options: {
            'mock': 'Optimize the app using the mocked data',
            'pretty': 'Will generate the js application as human readable code'
        }
    });

    /**
     *  Downloads the selenium webdriver.
     * This is an internal task, do not use it directly
     */
    gulp.task('webdriver_update', webdriver_update);

    /**
     *  Launches the unit tests and the end to end tests
     */
    gulp.task('test', 'Launches the unit tests and the end to end tests.', ['test-unit', 'test-e2e']);

    /**
     * Launches the end to end tests.
     */
    gulp.task("test-e2e", "Launches the end to end tests.", ["webdriver_update"],  function( done ) {
        //start the app
        var options = {};
        options.env = process.env;
        options.env.NODE_ENV = 'development';
        options.env.MOCK = 'YES';
        options.env.PORT = 7230;
        var server = $.liveServer(["./webServer/app.js"], options);
        server.start();
        //start the tests
        gulp.src(['./test/e2e/test.e2e.*.js'])
            .pipe(protractor({
                'configFile': './e2e.conf.js',
                'debug': false
            }))
            .on('error', function(e) {
                server.stop();
                throw e;
            })
            .once('close', function() {
                console.log('quit');
                //stop the app
                server.stop();
            });
    });

    /**
     * Launches the unit tests.
     */
    gulp.task("test-unit", "Launches the unit tests.", function ( done ) {

        var server = new Karma({
            configFile: __dirname + '/karma.conf.js'
        }, done);
        server.start();
    });
    /**
     * Builds a war with the optimized application so that it can be deployed on a JEE container.
     * This will generate a basic web.xml in a WEB-INF subfolder.
     */
    gulp.task("war", "Builds a war with the optimized application so that it can be deployed on a JEE container.", ["optimize"], function ( done ) {

        var content = JSON.parse(fs.readFileSync("./package.json"))
        var warName = content.name + "-" + content.version + "-" + "SNAPSHOT.war";

        return gulp.src([config.target + "/**/*.*"])
            .pipe($.war({
                welcome: "index.html",
                displayName: "Gulp WAR"
            }))
            .pipe($.zip(warName))
            .pipe(gulp.dest(config.dist));
    },  {
        options: {
            'mock': 'Packages the app with the mocked data',
            'pretty': 'Will generate the js application as human readable code'
        }
    });

    /**
     * Builds a static distribution of the application in a zip file so that it can be deployed on a web server.
     */
    gulp.task("dist", "Builds a static distribution of the application in a zip file so that it can be deployed on a web server.", ["optimize"], function (done) {

        return gulp.src([config.target + "**/*.*"])
            .pipe($.file("StaticFile","This file is here so that cloud foundry uses the correct buildpack"))
            .pipe($.zip("app.zip"))
            .pipe(gulp.dest(config.dist));

    },  {
        options: {
            'mock': 'Packages the app with the mocked data'
        }
    });

    ///CORDOVA
    /**
     * Builds an apk file with the optimized application so that it can be deployed on an android device.
     * It uses Cordova to embed the web app into a native application harness.
     */
    gulp.task('apk', 'Builds an apk file with the optimized application so that it can be deployed on an android device.', ['optimize'], function() {
        return gulp.src('./target')
            .pipe($.cordovaCreate())
            .pipe($.cordovaBuildAndroid())
            .pipe(gulp.dest('./dist/apk'));
    },  {
        options: {
            'mock': 'Packages the app with the mocked data',
            'pretty': 'Will generate the js application as human readable code'
        }
    });

    ///////////////////

    /**
     * Utility function to serve the app in dev mode or in build mode.
     */
    function serve(env) {

        var isDev = env != "build";
        log(config);
        log(config.port);
        var nodeOptions = {
            script: "./webServer/app.js",
            delayTime: 1,
            env: {
                "PORT": port,
                "NODE_ENV": env,
                "MOCK": args.mock ? "YES" : "NO"
            },
            watch: [config.server]
        };

        log("launching");
        return $.nodemon(nodeOptions)
            .on("restart", function (ev) {
                log("*** nodemon restarted");
                log("files changed on restart:\n" + ev);
                setTimeout(function () {
                    browserSync.notify("reloading now...");
                    browserSync.reload({stream: false});
                }, config.browserReloadDelay);
            })
            .on("start", function () {
                log("*** nodemon started");
                startBrowserSync(isDev);
            })
            .on("crash", function () {
                log("*** nodemon crashed: script crashed for some reason");
            })
            .on("exit", function () {
                log("*** nodemon exited cleanly");
            });
    }

    /**
     * Serve the app with browserSync capability.
     */
    function startBrowserSync(isDev) {
        if (args.nosync || browserSync.active) {
            return;
        }
        log("Starting browser-sync on port " + port);

        if (isDev) {
            gulp.watch([config.js], ["jsHotReload"] );
            gulp.watch(config.styles, ["lessCompile"] );
            gulp.watch(config.langFiles, ["i18n"] );
        }

        var options = {
            proxy: "localhost:" + port,
            port: 3000,
            files: isDev ? [
                config.client + "**/*.html",
                config.client + "**/*.css",
                config.temp + "**/*.css"
            ] : [],
            ghostMode: {
                clicks: true,
                location: true,
                forms: true,
                scroll: true
            },
            injectsChanges: true,
            logFileChanges: true,
            logLevel: "debug",
            logPrefix: "gulp-patterns",
            notify: true,
            reloadDelay: 0
        };
        browserSync(options);
    }

    /**
     * Utility function to log a message into the console.
     */
    function log(msg) {
        if (typeof (msg) === "object") {
            for (var item in msg) {
                if (msg.hasOwnProperty(item)) {
                    $.util.log($.util.colors.green(msg[item]));
                }
            }
        } else {
            $.util.log($.util.colors.green(msg));
        }
    }

})();
