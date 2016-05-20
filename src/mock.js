'use strict';

var gulp = require('gulp');
var inquirer = require('inquirer');
var $ = require('gulp-load-plugins')({lazy: true});
var util = require('./utils');
var _ = require('lodash');
var del = require("del");
var fs = require('fs');
var args = require('yargs').argv;

/**
 * Default gulp task that scaffold the entire project
 *
 * @param dirName the base dirName of the generator
 * @returns the gulp task that scaffolds the project
 */
module.exports = function(dirName) {
    return function (done) {
        if(args._.length >= 3) {
            doScaffold(getArgsAnswers(), done);
        }else{
            inquirer.prompt(getPromptOptions(), function(answers){
                doScaffold(answers, done);
            });
        }
    };

    function doScaffold(answers, done){
        answers = extrapolateAnswer(answers);

        var json = JSON.parse(fs.readFileSync(answers.data));

        if(json.length !== undefined && json.length >= 0) {
            var item = json[0];
            if(args._.length >= 3) {
                extractProperties (answers, answers, item);
                makeMock(answers, dirName, done);
            } else {
                inquirer.prompt(getSecondaryPromptOptions(item), function (ans) {
                    extractProperties (ans, answers, item);
                    makeMock(answers, dirName,  done);
                });
            }
        };
    }

    function getPromptOptions(){

        var dataList = util.getMockData(".");

        //check if mocks files exists
        if (dataList == "") {
            util.log('You should add a mock file in your project! PLease check documentation : https://stash.eden.klm.com/projects/CSE/repos/slushgenerator/browse');
            return;
        }

        return[{
                type: 'list',
                name: 'data',
                message: 'The following json files were found in the root folder, which one do you want to use to generate the mock?',
                choices: dataList,
                default: 0
            },
            {
                type: 'confirm',
                name: 'delete',
                message: 'Do you want to delete the file afterward?',
                default: false
            }];

    }

    function getSecondaryPromptOptions(item){

        return  [{
            type: 'input',
            name: 'idProp',
            message: "What is the name of the unique identifier property",
            default: getDefaultIdName(item)
        }];

    }

    function getArgsAnswers(){
        return {
            data: args._[1],
            delete: args._[2] ==='true'?true:false,
            idProp: args._[3]
        };
    }

    function extrapolateAnswer(answers){
        answers.name = answers.data.replace(".json","").toLowerCase();


        answers.className = _.capitalize(answers.name) + "Mock";
        answers.varName = answers.name + "Mock";
        util.log(answers);

        answers.resourceNamePlural = answers.name;
        answers.controllerName = answers.name;
        answers.resourceName = answers.name.replace(/s$/,"");

        return answers;
    }

    function getDefaultIdName(item){
        for (var attr in item){
            return  attr;
        }
    }

    function extractProperties(ans, answers, item){
        var idProp = ans.idProp;
        var isTechId = false;
        var nbAttr = 0;

        answers.listProperties = [];
        answers.properties = [];
        answers.embedProperties = [];
        answers.idProp = idProp;

        for (var attr in item) {
            if (attr === idProp) {
                isTechId = true;
                continue;
            }
            if ((item[attr] === null || typeof item[attr]) !== "object") {
                if (nbAttr < 7) {
                    nbAttr++;
                    answers.listProperties.push(attr);
                }
                answers.properties.push(attr);
            } else {
                if (item[attr].length === undefined) {
                    var props = [];

                    var it = item[attr];
                    for (var at in it) {
                        if (typeof it[at] !== "object") {
                            props.push(at);
                        }
                    }

                    answers.embedProperties.push({
                        "name": attr,
                        "properties": props
                    });

                } else {
                    //Array
                    util.log(attr + " is an array. Not supported for now");
                }
            }

        }
        if (!isTechId) {
            throw  "Your Json object must have a " + answers.idProp + " attribute that is a unique identifier.";

        }
    }

    function makeMock(answers, dirName, done){
        var destPath = "./mock/" + answers.name;
        var src = [dirName + '/app/templates/mock/mock.js'];
        var creation = true;
        if( fs.existsSync(destPath + "/" + answers.name + ".mock.js")){
            creation = false;
        }

        gulp.src("./" + answers.data)
            .pipe($.rename(function (path) {
                path.extname = ".js";
                util.log(path);
            }))
            .pipe($.insert.prepend("export default "))
            .pipe(gulp.dest( destPath + "/data"))
            .on('finish', function () {
                gulp.src(src)
                    .pipe($.rename(function (path) {
                        path.basename = answers.name + "." + path.basename;
                        util.log(path);
                    }))
                    .pipe($.template(answers, {'interpolate': /<%=([\s\S]+?)%>/g}))
                    .pipe($.conflict(destPath))
                    .pipe(gulp.dest(destPath))
                    .on('finish', function () {
                        if(!creation){
                            done(undefined, answers);
                            if (answers.delete === true) {
                                del("./" + answers.data);
                            }
                        } else {
                            gulp.src("./mock/mock.module.js")
                                .pipe($.insert.wrap('import ' + answers.className + ' from "./' + answers.name + '/' + answers.name + '.mock";\n',
                                    'module.run(' + answers.className + '.initMock);\n'))
                                .pipe(gulp.dest("./mock"))
                                .on('finish', function () {
                                    done(undefined, answers);
                                    if (answers.delete === true) {
                                        del("./" + answers.data);
                                    }
                                });
                        }
                    });
            });
    }

}



