'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var util = require('./utils');
var args = require('yargs').argv;


/**
 * Create a gulp task to scaffold a service.
 * This will create a <serviceName>.service.js file in the picked module
 * and will add the required angular declaration in the module file
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds service
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
        answers.serviceServices = util.formatArray(answers.serviceServices);
        var serviceFileName = "";
        var templateName = ""
        var angularRegistration =  '';
        var serviceClassName = '';
        if(answers.serviceType == 'Factory'){
            serviceClassName = _.capitalize(answers.serviceName)  + 'Service';
            templateName = '/app/templates/factory.js';
            angularRegistration =  'module.factory("' + _.camelCase(serviceClassName)+ '", ' + serviceClassName +'.factory);\n'
            serviceFileName = _.camelCase(answers.serviceName) + ".service";

        } else if (answers.serviceType == 'Classic'){
            serviceClassName = _.capitalize(answers.serviceName)  + 'Service';
            templateName = '/app/templates/service.js';
            angularRegistration =  'module.service("' + _.camelCase(serviceClassName)+'", '+ serviceClassName +');\n'
            serviceFileName = _.camelCase(answers.serviceName) + ".service";
        } else {
            serviceClassName = _.capitalize(answers.serviceName)  + 'ResourceService';
            templateName = '/app/templates/resource.js';
            angularRegistration =  'module.factory("' + _.camelCase(serviceClassName)+'", '+ serviceClassName +'.factory);\n'
            serviceFileName = _.camelCase(answers.serviceName) + ".resource.service";
        }

        gulp.src(dirName + templateName)
            .pipe($.rename(function (path) {
                path.basename = serviceFileName;
                util.log(path);
            }))
            .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
            .pipe($.conflict(srcPath + answers.serviceModule))
            .pipe(gulp.dest(srcPath + answers.serviceModule)) // Relative to cwd
            .on('finish', function () {
                gulp.src(srcPath + answers.serviceModule+"/" + util.getModuleName(answers.serviceModule) + ".module.js")
                    .pipe($.insert.wrap('import '+ serviceClassName + ' from "./' + serviceFileName + '";\n',
                        angularRegistration))
                    .pipe(gulp.dest(srcPath + answers.serviceModule))
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
                name: 'serviceModule',
                message: 'In what module do you want to create the service?',
                choices: dirs
            },
            {
                type: 'input',
                name: 'serviceName',
                message: 'Enter the name of the service (will be suffixed with "Service")'
            },
            {
                type: 'input',
                name: 'serviceDescription',
                message: 'Enter a description for this service'
            },
            {
                type: 'input',
                name: 'serviceServices',
                message: 'Enter the services this service will use (space separated list)'
            },
            {
                type: 'list',
                name: 'serviceType',
                message: 'Enter the type of the service',
                choices: ['Classic', 'Resource', 'Factory']
            }
        ];
    }

    function getArgsAnswers(){
        return {
            serviceModule: args._[1],
            serviceName: args._[2],
            serviceDescription: args._[3] === undefined?"":args._[3],
            serviceServices: args._[4] === undefined?"":args._[4],
            serviceType: args._[5] === undefined?"Resource":args._[4],
        };
    }
}

