'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var util = require('./utils');


/**
 * Create a gulp task to scaffold a service.
 * This will create a <serviceName>.service.js file in the picked module
 * and will add the required angular declaration in the module file
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds service
 */
module.exports = function (dirName){
    return function(done) {

        var srcPath = './src/app/';
        var dirs = util.getModules(srcPath);

        var promptOptions =[
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

        //Task
        inquirer.prompt(promptOptions, function (answers) {
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


        });
    };
}

