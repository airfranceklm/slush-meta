'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var util = require('./utils');
var fs = require('fs');

/**
 * Create a gulp task to scaffold a module.
 * This will create a folder with the module name in the src/app folder
 * It will also create a app.<moduleName>.module.js file containing the angular declaration of the module
 * with it's provided dependencies.
 *
 * @param dirName the base directory of the generator project
 * @returns the gulp task
 */
module.exports = function (dirName){
    return function(done) {

        var srcPath = './src/app/';

        var intDeps = util.getModules(srcPath);
        var outDeps = [];

        gulp
            .src('./package.json')
            .pipe($.jsonEditor(function(json){

                for(var dep in json.jspm.dependencies){
                    outDeps = outDeps.concat(dep);
                }

                return json;
            }))
            .on('finish', proceed);



        function proceed() {

            var deps = intDeps.concat(outDeps);

            var promptOptions = [
                {
                    type: 'input',
                    name: 'moduleName',
                    message: 'Enter the name of the module'
                },
                {
                    type: 'input',
                    name: 'moduleDescription',
                    message: 'Enter a description for the module'
                },
                {
                    type: 'checkbox',
                    name: 'moduleDependencies',
                    message: 'Choose the other modules dependencies for this module (default none)',
                    choices: deps,
                    default: []
                },
                {
                    type: 'list',
                    name: 'parentModule',
                    message: 'If this is a sub-module choose a parent module',
                    choices: ['(not a sub-module)'].concat(intDeps),
                    default: 0
                }

            ];

            //Task
            inquirer.prompt(promptOptions, function (answers) {
                util.log(answers);
                if(answers.parentModule == '(not a sub-module)'){
                    answers.parentModule ='';
                }
                var rootModule = srcPath + "app.module.js";

                var destPath = srcPath;

                if(answers.parentModule != ""){
                    destPath += answers.parentModule + "/";
                }

                destPath += _.camelCase(answers.moduleName);
                var src = [dirName + '/app/templates/module.js'];

                answers.moduleDependencies = formatDepsWithPath(answers.moduleDependencies);

                var creation = true;
                if(fs.existsSync(destPath +"/" + _.camelCase(answers.moduleName) + ".module.js")){
                    // the module already exists, we don't have to declare it again, just update the file.
                    creation = false;
                }

                gulp.src(src)
                    .pipe($.rename(function (path) {
                        path.basename = _.camelCase(answers.moduleName) + "." + path.basename;
                        util.log(path);
                    }))
                    .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
                    .pipe($.conflict(destPath))
                    .pipe(gulp.dest(destPath))
                    .on('finish', function () {
                        if(!creation){
                            done();
                        } else {
                            //declaring the module in the parent module
                            var module = rootModule;
                            var destPath = srcPath;
                            if (answers.parentModule != "") {
                                destPath = srcPath + answers.parentModule + "/";

                                module = destPath + util.getModuleName(answers.parentModule) + ".module.js";
                                util.log("module " + module);
                            }

                            gulp.src(module)
                                .pipe($.insert.transform(function (contents) {
                                    return util.formatModules(contents, answers);
                                }))
                                .pipe($.insert.prepend('import ' + _.camelCase(answers.moduleName) + ' from "./' + _.camelCase(answers.moduleName) + '/' + _.camelCase(answers.moduleName) + '.module";\n'))
                                .pipe(gulp.dest(destPath))
                                .on('finish', function () {
                                    done(); //Finished
                                });
                        }
                    });
            });
        }

        /////////////////////////


        /**
         * format the dependency array
         * original dependency array is an array of strings with the name of the dependencies.
         * This function creates an array with an entry of the form
         * {
         * module
         * path
         * }
         * for each module.
         *
         * @param dependencies the dependencies needed for the module
         * @returns the formated array
         */
        function formatDepsWithPath(dependencies) {
            var depsAndPath = [];
            for (var i = 0; i < dependencies.length; i++) {
                var module = dependencies[i];
                var path = dependencies[i];
                if (intDeps.indexOf(module) > -1) {
                    path = '../' + module + '/' + module.replace(/^.*[\/\\](.*)/, '$1') + ".module";
                }
                depsAndPath = depsAndPath.concat({
                    module: module,
                    path: path
                });
            }
            return depsAndPath;
        }
    };
}

