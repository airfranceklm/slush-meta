#! /usr/bin/env node
(function() {

    var spawn = require('child_process').spawn;
    var npm = require("npm");
    var fs = require("fs");
    var userArgs = process.argv.slice(2);
    var myConfigObject = {}

    npm.load(myConfigObject, function (err) {
        if (err) {
            return handleError(err);
        }
        var command = getCommand();

        var args = getArgs();

        var cmd = spawn(command, args, {
            cwd: process.cwd(),
            stdio: 'inherit'
        });

        //listen for the 'exit' event
        //which fires when the process exits
        cmd.on('exit', function (code, signal) {
            if (code !== 0) {
                console.log("Error: program failed with error code " + code + "and signal " + signal);
            }
        });
    });

    /////////////////

    function handleError(err){
        console.log(err);
    }

    function getCommand(){
        // make a variable based on the system
        var slush = process.platform === "win32" ? "slush.cmd" : "slush";

        try {
            stats = fs.lstatSync(npm.bin + '/' + slush);
            console.log("Meta: using local installation of slush-meta");
            return npm.bin + '/' + slush;
        }
        catch (e) {
            console.log("Meta: using global installation of slush-meta");
            return slush;
        }
    }

    function getArgs(){
        if (userArgs.length > 0) {
            return ["meta:" + userArgs[0]];
        } else {
            return ["meta"];
        }
    }

})();
