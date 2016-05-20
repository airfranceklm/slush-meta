'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var util = require('./utils');
var args = require('yargs').argv;


/**
 * Create a gulp task to scaffold a controller.
 * This will create a <controllerName>.controller.js file in the picked module
 * and will add the required angular declaration in the module file
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds a controller
 */
module.exports = function (dirName){

    var srcPath = './src/app/';

    return function(done) {

        if(args._.length >= 3) {
            doScaffold(getArgsAnswers(), done);
        }else{
            inquirer.prompt(getPromptOptions(), function(answers){
                doScaffold(answers, done);
            });
        }
    };

    function doScaffold(answers, done){
        util.log(answers);
        answers.controllerServices = util.formatArray(answers.controllerServices);

        var controllerFileName = "";

        gulp.src(dirName + '/app/templates/controller.js')
            .pipe($.rename(function (path) {
                path.basename = _.camelCase(answers.controllerName) + "." + path.basename;
                controllerFileName = path.basename ;
                util.log(path);
            }))
            .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
            .pipe($.conflict(srcPath + answers.controllerModule))
            .pipe(gulp.dest(srcPath + answers.controllerModule)) // Relative to cwd
            .on('finish', function () {
                gulp.src(srcPath + answers.controllerModule+"/"+util.getModuleName(answers.controllerModule) + ".module.js")
                    .pipe($.insert.wrap('import '+ _.capitalize(answers.controllerName)  + 'Controller from "./' + controllerFileName + '";\n',
                        'module.controller("' + _.capitalize(answers.controllerName)+'Controller", '+ _.capitalize(answers.controllerName) +'Controller);\n' ))
                    .pipe(gulp.dest(srcPath + answers.controllerModule))
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
                name: 'controllerModule',
                message: 'In what module do you want to create the controller?',
                choices: dirs
            },
            {
                type: 'input',
                name: 'controllerName',
                message: 'Enter the name of the controller (will be suffixed with "Controller")'
            },
            {
                type: 'input',
                name: 'controllerDescription',
                message: 'Enter a description for this controller'
            },
            {
                type: 'input',
                name: 'controllerServices',
                message: 'Enter the services this controller will use (space separated list)'
            }
        ];
    }

    function getArgsAnswers(){
        return {
            controllerModule: args._[1],
            controllerName: args._[2],
            controllerDescription: args._[3] === undefined?"":args._[3],
            controllerServices: args._[4] === undefined?"":args._[4]
        };
    }
}

