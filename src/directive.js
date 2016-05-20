'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var util = require('./utils');
var args = require('yargs').argv;


/**
 * Create a gulp task to scaffold a directive.
 * This will create a <directiveName>.directive.js file in the picked module
 * and will add the required angular declaration in the module file
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds a directive
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
        answers.directiveServices = util.formatArray(answers.directiveServices);
        var directiveFileName = "";
        gulp.src(dirName + '/app/templates/directive.js')
            .pipe($.rename(function (path) {
                path.basename = _.camelCase(answers.directiveName) + "." + path.basename;
                directiveFileName = path.basename ;
                util.log(path);
            }))
            .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
            .pipe($.conflict(srcPath + answers.directiveModule))
            .pipe(gulp.dest(srcPath + answers.directiveModule)) // Relative to cwd
            .on('finish', function () {
                gulp.src(srcPath + answers.directiveModule+"/"+ util.getModuleName(answers.directiveModule) +".module.js")
                    .pipe($.insert.wrap('import '+ _.capitalize(answers.directiveName)  + 'Directive from "./' + directiveFileName + '";\n',
                        'module.directive("' + _.camelCase(answers.directiveName)+'", '+ _.capitalize(answers.directiveName) +'Directive.factory);\n' ))
                    .pipe(gulp.dest(srcPath + answers.directiveModule))
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
                name: 'directiveModule',
                message: 'In what module do you want to create the directive?',
                choices: dirs
            },
            {
                type: 'input',
                name: 'directiveName',
                message: 'Enter the name of the directive (will be suffixed with "Directive")'
            },
            {
                type: 'input',
                name: 'directiveDescription',
                message: 'Enter a description for this directive'
            },
            {
                type: 'input',
                name: 'directiveServices',
                message: 'Enter the services this directive will use (space separated list)'
            }
        ];
    }

    function getArgsAnswers(){
        return {
            directiveModule: args._[1],
            directiveName: args._[2],
            directiveDescription: args._[3] === undefined?"":args._[3],
            directiveServices: args._[4] === undefined?"":args._[4]
        };
    }
}

