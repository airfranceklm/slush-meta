'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var childProcess = require('child_process');
var which = require('which');
var util = require('./utils');
var path = require('path');

/**
 * Default gulp task that scaffold the entire project
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds the project
 */
module.exports = function(dirName) {
    return function (done) {

        var cwd = path.basename(process.cwd());

        var promptOptions = [{
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

        inquirer.prompt(promptOptions, function (answers) {
            if ( answers.backendAppUrl === ""){
                answers.backendAppUrl = "www." + answers.appName + ".com";
            }
            util.log(answers);

            var filter = $.filter(["**/*.*", "!**/*.jpg", "!**/*.png", "!**/*.gif"]);

            var srcFiles = [dirName + '/app/projectTemplate/**/*.*', dirName + '/app/projectTemplate/**/.*', '!' + dirName + '/app/projectTemplate/**/.DS_Store'];
            gulp.src(srcFiles) // Relative to __dirname
                .pipe(filter)
                .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
                .pipe(filter.restore())
                .pipe($.conflict('./'))
                .pipe(gulp.dest('./')) // Relative to cwd
                //.pipe($.install(installOptions))
                .on('finish', function () {

                    which('npm', function(err, cmdpath){
                        if (err) {
                            console.log(new Error('Can\'t install! `' + command.cmd + '` doesn\'t seem to be installed.'));
                            return;
                        }
                        var cmd = childProcess.spawn(cmdpath, ["install", "--no-optional"], {stdio: 'inherit', cwd: process.cwd()});
                       // console.log(cmd);
                        cmd.on('close', function (code) {
                            if (code !== 0) {
                                console.log(new Error(command.cmd + ' exited with non-zero code ' + code));
                            }
                            done(); // Finished!
                        });
                    });

                });
        });

    };
}
