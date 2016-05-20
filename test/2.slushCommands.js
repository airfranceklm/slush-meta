"use strict";
var assert = require("yeoman-assert");
var fs = require("fs-extra");
var path = require("path");
var spawn = require('child_process').spawn;
var instancePath = path.join(__dirname , "../../.test-instance/");
var appPath = path.join(__dirname , "..");
var slush = path.join(instancePath, "node_modules/slush/bin/slush.js");

var debug = true;

describe("Slush commands", function() {

    var error;

    if(debug) {
        describe("install slush-meta", function () {
            var errs;
            beforeEach(function (done) {
                this.timeout(0);

                fs.copy(appPath, instancePath + "/node_modules/slush-meta", {
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

            it("should have installed slush-me locally", function () {
                assert.equal(errs, undefined);
                assert.file(instancePath + "node_modules/slush-meta");
            });
        });
    }


    describe("Slush meta:module", function () {

        testCommand(["meta:module", "testModule", "The test module", "core,widgets"]);

        it("Should not fail and create a module", function () {
            assert.equal(error, false);
            assert.file(instancePath + "src/app/testModule/testModule.module.js");
        });
    });

    describe("Slush me:controller", function () {

        testCommand(["me:controller", "testModule", "Test", "The test controller", "message"]);

        it("Should not fail and create a controller", function () {
            assert.equal(error, false);
            assert.file(instancePath + "src/app/testModule/test.controller.js");
        });
    });

    describe("Slush meta:service", function () {

        testCommand(["meta:service", "testModule", "Test", "The test service"]);

        it("Should not fail and create a service", function () {
            assert.equal(error, false);
            assert.file(instancePath + "src/app/testModule/test.resource.service.js");
        });
    });

    describe("Slush meta:directive", function () {

        testCommand(["meta:directive", "testModule", "Test", "The test directive"]);

        it("Should not fail and create a directive", function () {
            assert.equal(error, false);
            assert.file(instancePath + "src/app/testModule/test.directive.js");
        });
    });

    describe("Slush meta:filter", function () {

        testCommand(["meta:filter", "testModule", "Test", "The test filter"]);

        it("Should not fail and create a filter", function () {
            assert.equal(error, false);
            assert.file(instancePath + "src/app/testModule/test.filter.js");
        });
    });

    describe("Slush meta:route", function () {

        testCommand(["meta:route", "testModule", "myView", "true"]);

        it("Should not fail and create an empty route file", function () {
            assert.equal(error, false);
            assert.file(instancePath + "src/app/testModule/testModule.route.js");
        });
    });

    describe("Slush meta:view", function () {

        testCommand(["meta:view", "testModule", "myView", "true"]);

        it("Should not fail, create a view and embed declaration in the existing empty route file", function () {
            assert.equal(error, false);
            assert.file(instancePath + "src/app/testModule/myView.html");
            assert.file(instancePath + "src/app/testModule/testModule.route.js");
            // test if the declaration is valid (maybe later with the gulp analyse test)
        });
    });
    describe("Slush meta:view again", function () {

        testCommand(["meta:view", "testModule", "myView2", "true"]);

        it("Should not fail and create another view and embed the route declaration in the existing route file, with existing route configuration.", function () {
            assert.equal(error, false);
            assert.file(instancePath + "src/app/testModule/myView.html");
            assert.file(instancePath + "src/app/testModule/testModule.route.js");
            // test if the declaration is valid (maybe later with the gulp analyse test)
        });
    });

    describe("Slush meta:mock", function () {

        beforeEach(function(done){
            fs.copy("./test/persons.json", instancePath + 'persons.json', function (err) {
                if (err) return console.error(err);
                done();
            });
        })

        testCommand(["meta:mock", "persons.json", "false", "index"]);

        it("Should not fail and create a mock/persons folder with appropriate files. It should not delete the persons.json file.", function () {
            assert.equal(error, false);
            assert.file(instancePath + "mock/persons/persons.mock.js");
            assert.file(instancePath + "mock/persons/data/persons.js");
            assert.file(instancePath + "persons.json");
        });
    });

    describe("Slush meta:crud", function () {

        testCommand(["meta:crud", "persons.json", "true", "index"]);

        it("Should not fail and create a src/app/person module. It should delete the persons.json file.", function () {
            assert.equal(error, false);
            assert.file(instancePath + "src/app/person/person.module.js");
            assert.noFile(instancePath + "persons.json");
        });
    });

    /////////

    function testCommand(cmdArgs) {
        beforeEach(function (done) {
            this.timeout(5000);
            var cmd = spawn(slush, cmdArgs, {
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


