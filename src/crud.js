'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var util = require('./utils');
var _ = require('lodash');
var mock = require("./mock");

/**
 * Default gulp task that scaffold the entire project
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds the project
 */
module.exports = function(dirName) {
    return function (done) {

        var mockFunction = mock(dirName, false);

        mockFunction(function(answers) {

            var destPath = "src/app/" + answers.resourceName;
            var module = './src/app/app.module.js';
            gulp.src(dirName + "/app/templates/crud/**/*.*")
                .pipe($.rename(function (path) {
                    if (path.dirname === ".") {
                        path.basename = answers.resourceName + "." + path.basename;
                    } else if (path.dirname === "edit") {
                        path.dirname = answers.resourceName + "Edit";
                        if (path.extname === ".html") {
                            path.basename = answers.resourceName + "." + path.basename;
                        } else {
                            path.basename = answers.resourceName + path.basename;
                        }

                    }
                }))
                .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
                .pipe($.conflict(destPath))
                .pipe(gulp.dest(destPath))
                .on("end", function () {

                    gulp.src(module)
                        .pipe($.insert.prepend('import ' + _.camelCase(answers.resourceName) + ' from "./' + _.camelCase(answers.resourceName) + '/' + _.camelCase(answers.resourceName) + '.module";\n'))
                        .pipe($.insert.transform(function (contents) {
                            answers.moduleName = answers.resourceName;
                            contents = util.formatModules(contents, answers);
                            return contents;
                        }))
                        .pipe(gulp.dest("./src/app/"))
                        .on('finish', function () {
                            done(); //Finished
                        });

                });
        });
    };
}

