'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var util = require('./utils');
var args = require('yargs').argv;

/**
 * Creates an empty route file.
 * This will create a <moduleName>.route.js file in the picked module
 * and will add the required angular declaration in the module file
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds a route
 */
module.exports = function (dirName){

    var srcPath = './src/app/';

    return function(done) {
        if(args._.length >= 2) {
            doScaffold(getArgsAnswers(), done);
        }else{
            inquirer.prompt(getPromptOptions(), function(answers){
                doScaffold(answers, done);
            });
        }
    };

    function doScaffold(answers, done){
        util.log(answers);

        answers.viewUrl = null;
        var routeFileName = "";
        var moduleName = util.getModuleName(answers.modulePath);
        util.log(answers.modulePath);
        util.log(moduleName);
        answers.moduleName = moduleName;

        gulp.src(dirName + '/app/templates/route.js')
            .pipe($.rename(function (path) {
                path.basename = answers.moduleName + "." + path.basename;
                routeFileName = path.basename ;
            }))
            .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
            .pipe($.conflict(srcPath + answers.modulePath))
            .pipe(gulp.dest(srcPath + answers.modulePath)) // Relative to cwd
            .on('finish', function () {

                gulp.src(srcPath + answers.modulePath + "/" + answers.moduleName+".module.js")
                    .pipe($.insert.wrap('import '+ _.capitalize(answers.moduleName)  + 'Route from "./' + routeFileName + '";\nimport angularUiRouter from "angular-ui-router";\n',
                        'module.config(' + _.capitalize(answers.moduleName) +'Route.initRoute);\n' ))
                    .pipe($.insert.transform(function (contents) {
                        contents = util.formatModules(contents, {moduleName: 'angularUiRouter'});
                        return contents;
                    }))
                    .pipe(gulp.dest(srcPath + answers.modulePath))
                    .on('finish', function () {
                        done(); //Finished
                    });
            });
    }

    function getPromptOptions(){

        var dirs = util.getModules(srcPath);

        return [
            {
                type: 'list',
                name: 'modulePath',
                message: 'For what module do you want to create the route?',
                choices: dirs
            }
        ];

    }

    function getArgsAnswers(){
        return {
            modulePath: args._[1]
        };
    }
}

