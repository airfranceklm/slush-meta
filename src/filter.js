'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var util = require('./utils');


/**
 * Create a gulp task to scaffold a filter.
 * This will create a <filterName>.filter.js file in the picked module
 * and will add the required angular declaration in the module file
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds a controller
 */
module.exports = function (dirName){
    return function(done) {

        var srcPath = './src/app/';
        var dirs = util.getModules(srcPath);

        var promptOptions =[
            {
                type: 'list',
                name: 'filterModule',
                message: 'In what module do you want to create the filter?',
                choices: dirs
            },
            {
                type: 'input',
                name: 'filterName',
                message: 'Enter the name of the filter (will be suffixed with "Filter")'
            },
            {
                type: 'input',
                name: 'filterDescription',
                message: 'Enter a description for this filter'
            }
        ];

        //Task
        inquirer.prompt(promptOptions, function (answers) {
            util.log(answers);

            var filterFileName = "";

            gulp.src(dirName + '/app/templates/filter.js')
                .pipe($.rename(function (path) {
                    path.basename = _.camelCase(answers.filterName) + "." + path.basename;
                    filterFileName = path.basename ;
                    util.log(path);
                }))
                .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
                .pipe($.conflict(srcPath + answers.filterModule))
                .pipe(gulp.dest(srcPath + answers.filterModule)) // Relative to cwd
                .on('finish', function () {
                    gulp.src(srcPath + answers.filterModule + "/"+util.getModuleName(answers.filterModule) + ".module.js")
                        .pipe($.insert.wrap('import '+ _.capitalize(answers.filterName)  + 'Filter from "./' + filterFileName + '";\n',
                            'module.filter("' + _.capitalize(answers.filterName)+'Filter", '+ _.capitalize(answers.filterName) +'Filter.factory);\n' ))
                        .pipe(gulp.dest(srcPath + answers.filterModule))
                        .on('finish', function () {
                            done(); //Finished
                        });
                });


        });
    };
}

