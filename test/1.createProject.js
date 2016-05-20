"use strict";
var assert = require("yeoman-assert");
var del = require("del");
var fs = require("fs-extra");
var mkdirp = require("mkdirp");
var path = require("path");
var spawn = require('child_process').spawn;
var which = require("which");
var instancePath = path.join(__dirname , "../../.test-instance/");
var appPath = path.join(__dirname , "..");
var slush = path.join(instancePath, "node_modules/slush/bin/slush.js");

var debug = true;

describe("init tests", function() {
    describe("clean", function () {
        beforeEach(function (done) {
            this.timeout(50000);
            del([instancePath + "/!**!/!*", instancePath], {force: true}).then(function (paths){
                done();
            }, function (err) {
                console.log(err);
                done();
            });
        });

        it("should remove .test-instance folder", function() {
            assert.noFile(instancePath);
        });
    });

    describe("create .test-instance folder", function () {
        var error;
        beforeEach(function (done) {
            this.timeout(10000);
            mkdirp(instancePath, function(err) {
                error = err;
                done();
            });
        });

        it("should have created .test-instance folder", function() {
            assert.equal(error, undefined);
            assert.file(instancePath);
        });
    });

    describe("install slush", function () {
        var error;
        beforeEach(function (done) {
            this.timeout(0);

            which('npm', function(err, cmdpath){
                if (err) {
                    error = err;
                    done();
                    return;
                }

                var cmd = spawn(cmdpath, ["install", "slush"], {
                    cwd: instancePath,
                    stdio: debug?"inherit":null
                });

                //listen for the 'exit' event
                //which fires when the process exits
                cmd.on("exit", function (code, signal) {
                    error =  code !== 0;;
                    done();
                });
            });
        });

        it("should have installed slush locally", function() {
            assert.equal(error, false);
            assert.file(instancePath + "node_modules/slush");
        });
    });

    describe("install slush-meta", function () {
        var error;
        beforeEach(function (done) {
            this.timeout(0);

            fs.copy(appPath, instancePath + "/node_modules/slush-meta", {
                    filter: function(path){
                        if(path.match(/slushGen\/test\//gi) ||
                            path.match(/slushGen\/\.idea\//gi)) {
                            return false;
                        }
                        return true;
                    }
                },
                function(err){
                    error = err;
                    done();
                });

        });

        it("should have installed slush-meta locally", function() {
            assert.equal(error, undefined);
            assert.file(instancePath + "node_modules/slush-meta");
        });
    });


});

describe("Create project", function() {

    describe("slush meta", function () {

        var error;

        beforeEach(function (done) {
            this.timeout(0);

            var cmd = spawn(slush, ["meta", "testApp", "testAppBe"], {
                cwd: instancePath,
                stdio: debug?"inherit":null
            });

            cmd.on("exit", function (code, signal) {
                error = code !== 0;
                done();
            });
        });


        it("should not fail...", function () {
            assert.equal(error, false);
        });
    });
});

