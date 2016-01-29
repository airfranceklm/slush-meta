import mock from "../../mock/mock.module";
import angular from "angular";
import app from "./app.module";
import "json.date-extensions";

JSON.useDateParser();
/*globals document:false*/

angular.bootstrap(document, [app, mock]);
