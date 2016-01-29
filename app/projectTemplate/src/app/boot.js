import angular from "angular";
import "json.date-extensions";
import app from "./app.module";

JSON.useDateParser();
/*globals document:false*/

angular.bootstrap(document, [app]);
