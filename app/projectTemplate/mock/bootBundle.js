import mock from "./mock.module";
import angular from "angular";
import app from "../src/app/app.module";
import "json.date-extensions";

JSON.useDateParser();
/*globals document:false*/

angular.bootstrap(document, [app, mock]);
