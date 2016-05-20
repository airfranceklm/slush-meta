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
var gulp = path.join(instancePath, "node_modules/gulp/bin/gulp.js");

var debug = true;

describe("Gulp commands", function() {

    var error;

  /*  if(debug) {
        describe("install slush-me", function () {
            var errs;
            beforeEach(function (done) {
                this.timeout(0);

                fs.copy(appPath, instancePath + "/node_modules/slush-me", {
                        filter: function (path) {
                            if (path.match(/slushGen\/test\//gi) ||
                                path.match(/slushGen\/\.idea\//gi)) {
                                return false;
                            }
                            return true;
                        }
                    },
                    function (err) {
                        errs = err;
                        done();
                    });

            });

        });
    }
*/

    describe("Gulp analyse", function () {

        testCommand(["analyse"]);

        it("Should not fail", function () {
            assert.equal(error, false);
        });
    });

    describe("Gulp test-unit", function () {

        testCommand(["test-unit"]);

        it("Should not fail", function () {
            assert.equal(error, false);
        });
    });

    describe("Gulp optimize", function () {

        testCommand(["optimize"]);

        it("Should not fail", function () {
            assert.equal(error, false);
            assert.file(instancePath + "target/index.html");
        });
    });

    describe("Gulp war", function () {

        testCommand(["war"]);

        it("Should not fail and create a war file in dist folder", function () {
            assert.equal(error, false);
            assert.file(instancePath +"dist/testApp-0.0.1-SNAPSHOT.war");
        });
    });

    describe("Gulp dist", function () {

        testCommand(["dist"]);

        it("Should not fail and create a zip file in dist folder", function () {
            assert.equal(error, false);
            assert.file(instancePath +"dist/app.zip");
        });
    });


    /////////

    function testCommand(cmdArgs) {
        beforeEach(function (done) {
            this.timeout(0);
            var cmd = spawn(gulp, cmdArgs, {
                cwd: instancePath,
                stdio: debug?"inherit":null
            });

            cmd.on("exit", function (code, signal) {
                error = code !== 0;
                done();
            });
        });
    }
});


