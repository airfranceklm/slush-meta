'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var util = require('./utils');
var fs = require("fs");


/**
 * Create a gulp task to scaffold a controller.
 * This will create a <controllerName>.controller.js file in the picked module
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




        inquirer.prompt(promptOptions, function (answers) {
            util.log(answers);

            var moduleName = util.getModuleName(answers.modulePath);

            if(answers.createRoute) {

                var routePromptOptions = [
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

                inquirer.prompt(routePromptOptions, function(routeAnswers){

                    var totalAnswers = _.merge(answers, routeAnswers);
                    util.log(totalAnswers);
                    doTask(totalAnswers);
                });
            }else {
                doTask(answers);
            }

        });

        //Task
        function doTask(answers) {

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
    };
}

