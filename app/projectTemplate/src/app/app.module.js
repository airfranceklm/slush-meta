import angular from "angular";
import appConfig from "./app.config";
import core from "./core/core.module";
import user from "./user/user.module";
import widgets from "./widgets/widgets.module";
import {} from "bootstrap/css/bootstrap.css!";

/*eslint no-unused-vars: 0*/
/**
 * Main app module angular boiler plate
 */
let moduleName = "app";
export default moduleName;

let module = angular
    .module(moduleName, [
        core,
        widgets,
        user
    ]);

module.config(appConfig.factory);
