'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var childProcess = require('child_process');
var which = require('which');
var util = require('./utils');
var path = require('path');
var args = require('yargs').argv;

/**
 * Default gulp task that scaffold the entire project
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds the project
 */
module.exports = function(dirName) {
    return function (done) {
        if(args._.length >= 2) {
            doScaffold(getArgsAnswers(), done);
        }else{
            inquirer.prompt(getPromptOptions(), function(answers){
                doScaffold(answers, done);
            });
        }
    };

    function doScaffold(answers, done) {
        if ( answers.backendAppUrl === ""){
            answers.backendAppUrl = "www." + answers.appName + ".com";
        }
        util.log(answers);

        var filter = $.filter(["**/*.*", "!**/*.jpg", "!**/*.png", "!**/*.gif"]);
        var filterNpmIgnore = $.filter(["**/.npmignore"]);

        var srcFiles = [dirName + '/app/projectTemplate/**/*.*', dirName + '/app/projectTemplate/**/.*', '!' + dirName + '/app/projectTemplate/**/.DS_Store'];
        gulp.src(srcFiles) // Relative to __dirname
            .pipe(filter)
            .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
            .pipe(filter.restore())
            .pipe($.conflict('./'))
            .pipe(filterNpmIgnore)
            .pipe($.rename(function(path){
                path.basename = ".gitignore";
            }))
            .pipe(filterNpmIgnore.restore())
            .pipe(gulp.dest('./')) // Relative to cwd
            .on('finish', function () {

                which('npm', function(err, cmdpath){
                    if (err) {
                        console.log(new Error('Can\'t install!'));
                        return -1;
                    }
                    var cmd = childProcess.spawn(cmdpath, ["install", "--no-optional"], {stdio: 'inherit', cwd: process.cwd()});
                    // console.log(cmd);
                    cmd.on('close', function (code) {
                        if (code !== 0) {
                            var err = new Error('npm install exited with non-zero code ' + code);
                            console.log(err);
                            done(err);
                        }else {
                            done(); // Finished!
                        }
                    });
                });

            });
    }

    function getPromptOptions(){
        var cwd = path.basename(process.cwd());
        return [{
            type: 'input',
            name: 'appName',
            message: 'Name of the application?',
            default: cwd
        },
            {
                type: 'input',
                name: 'backendAppUrl',
                message: 'Enter the url of the back end application? (optional)'
            }
        ];
    }

    function getArgsAnswers(){
        return {
            appName: args._[1],
            backendAppName: args._[2] === undefined?"":args._[2]
        };
    }

}


