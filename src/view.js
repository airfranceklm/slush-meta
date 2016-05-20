'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var util = require('./utils');
var fs = require("fs");
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
            inquirer.prompt(getPromptOptions(), function(answers) {
                if(answers.createRoute) {
                    inquirer.prompt(getSecondPromptOptions(answers), function(routeAnswers){
                        var totalAnswers = _.merge(answers, routeAnswers);
                        doScaffold(totalAnswers, done);
                    });
                }else {
                    doScaffold(answers, done);
                }
            });
        }
    };

    //Task
    function doScaffold(answers, done) {
        util.log(answers);

        var src = [dirName + '/app/templates/view.html']
        var routeAlreadyExists = false;
        var moduleName = util.getModuleName(answers.modulePath);

        answers.moduleName = moduleName;
        var routeFileName = moduleName + '.route';
        var modulePath = srcPath + answers.modulePath + "/";
        if(answers.createRoute) {
            try {
                console.log("ROUTE PATH :" + modulePath + routeFileName + '.js');
                fs.lstatSync(modulePath + routeFileName + '.js') != null;
                routeAlreadyExists = true;
            }catch(e){
                src = src.concat(dirName + '/app/templates/route.js');
            }
        }

        gulp.src(src)
            .pipe($.rename(function (path) {
                if(path.extname === '.js'){
                    path.basename = _.camelCase(moduleName) + '.' + path.basename;
                    routeFileName = path.basename;
                }else {
                    path.basename = _.camelCase(answers.viewName);
                }
                util.log(path);
            }))
            .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
            .pipe($.conflict(modulePath))
            .pipe(gulp.dest(modulePath)) // Relative to cwd
            .on('finish', function () {

                if(answers.createRoute) {


                    gulp.src(modulePath + "/" + moduleName + ".module.js")
                        .pipe($.if(!routeAlreadyExists,$.insert.wrap('import '+ _.capitalize(moduleName)  + 'Route from "./' + routeFileName + '";\nimport angularUiRouter from "angular-ui-router";\n',
                            'module.config(' + _.capitalize(moduleName) +'Route.initRoute);\n' )))
                        .pipe($.insert.transform(function (contents) {
                            contents = util.formatModules(contents, {moduleName: 'angularUiRouter'});
                            return contents;
                        }))
                        .pipe(gulp.dest(modulePath))
                        .on('finish', function () {
                            if (routeAlreadyExists && answers.createRoute) {
                                gulp.src(modulePath + routeFileName + '.js')
                                    .pipe($.insert.transform(function (contents) {
                                        contents = util.formatRoutes(contents, answers);
                                        return contents;
                                    }))
                                    .pipe(gulp.dest(modulePath))
                                    .on('finish', function () {
                                        done(); //Finished
                                    });
                            }else {
                                done(); //Finished
                            }
                        });
                }
            });
    }

    function getPromptOptions(){

        var dirs = util.getModules(srcPath);

        return [
            {
                type: 'list',
                name: 'modulePath',
                message: 'In what module do you want to create the view?',
                choices: dirs
            },
            {
                type: 'input',
                name: 'viewName',
                message: 'Enter the name of the view'
            },
            {
                type: 'confirm',
                name: 'createRoute',
                message: 'Do you want to create the route for this view?'
            }
        ];
    }

    function getSecondPromptOptions(answers){
        var moduleName = util.getModuleName(answers.modulePath);
        return [
            {
                type: 'input',
                name: 'viewUrl',
                message: 'Enter the url of the view',
                default: answers.modulePath + '/' + answers.viewName
            },
            {
                type: 'input',
                name: 'controllerName',
                message: 'Enter the name of the controller class',
                default: _.capitalize(moduleName) + "Controller"
            },
            {
                type: 'input',
                name: 'controllerAsName',
                message: 'Enter the "controllerAs" name of the controller',
                default: answers.viewName
            }
        ];
    }

    function getArgsAnswers(){
        return {
            modulePath: args._[1],
            viewName: args._[2],
            createRoute: args._[3] === undefined?false:args._[3],
            viewUrl: args._[4] === undefined?(args._[1] + "/" + args._[2]):args._[4],
            controllerName: args._[5] === undefined?(_.capitalize(util.getModuleName(args._[1])) + "Controller"):args._[5],
            controllerAsName: args._[6] === undefined?args._[2]:args._[6],
        };
    }
}

