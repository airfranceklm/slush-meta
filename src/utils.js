var fs = require("fs");
var $ = require('gulp-load-plugins')({lazy: true});
var path = require('path');
var _ = require("lodash");

var util = {
    log : log,
    getModules : getModules,
    formatArray : formatArray,
    formatModules : formatModules,
    formatRoutes: formatRoutes,
    getModuleName: getModuleName,
    getMockData: getMockData
}

module.exports = util;

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(item + ' : ' + msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function getModules(dir) {
    var results = []
    var list = fs.readdirSync(dir).filter(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            try {
                // Query the entry
                fs.lstatSync(path.join(dir, file) + '/' + file + '.module.js');
                //module file exists
                return true;
            }
            catch (e) {
                //module file doesn't exist
                return false;
            }
        }
        return false;
    });

    list.forEach(function(file) {
        file = dir +  file ;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results.push(file.replace("./src/app/",""));
            results = results.concat(getModules(file + '/'));
        }
    })
    return results;
}

function getMockData(dir) {

    return fs.readdirSync(dir).filter(function (file) {
        if (path.extname(file) == ".json" && path.basename(file) != "package.json") {
                return true;
        }
        return false;
    });

}


function formatArray(sourceString) {
    var array = sourceString.trim().split(" ");
    if (array.length == 1 && array[0].trim() === "") {
        array = [];
    }
    return array;
}

function formatModules(contents, answers) {
    var regexp = /(\.module\s*\(\s*[\d\w\$\"\']*,\s*\[\s*)(([\d\w\$]+,?\s*)*)/;

    var m = regexp.exec(contents);

    var modules = m[2].split(',');

    modules.splice(modules.length, 0, '\n        ' + _.camelCase(answers.moduleName));

    var modString = '';
    for (var i = 0; i < modules.length; i++) {
        modString += modules[i].trim();
        if(modString === _.camelCase(answers.moduleName)){
            return contents;
        }
        if (i != modules.length - 1) {
            if(modString != ''){
                modString += ',\n        ';
            }else{
                modString += '\n        ';
            }
        } else {
            modString += '\n';
        }
    }
    modString += '    ';

    contents = contents.replace(regexp, "$1" + modString);
    return contents;
}

function formatRoutes(contents, answers) {
    var regexp = /(\$stateProvider\s*)(\.state([\d\w\$\"\'\(\)\,{:\/\.}]*\s*)*)/;
    var route = '.state("' + answers.viewName + '", {\n'+
        '                url: "/' + answers.viewUrl + '",\n' +
        '                templateUrl: "app/' + answers.moduleName + '/' + answers.viewName + '.html",\n' +
        '                controller: "' + answers.controllerName + '",\n' +
        '                controllerAs: "' + answers.controllerAsName + '"\n' +
        '            })\n            ';

    contents = contents.replace(regexp, "$1" + route +"$2");
    return contents;
}

function getModuleName(modulePath){
    return modulePath.replace(/^.*[\/\\](.*)/, '$1');
}
