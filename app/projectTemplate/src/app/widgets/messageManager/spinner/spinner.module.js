import SpinnerController from "./spinner.controller";
import SpinnerDirective from "./spinner.directive";
import angular from "angular";

/*eslint no-unused-vars: 0*/
/**
 * Module spinner
 * The module responsible of displaying a wait spinner
 */
let moduleName = "app.widgets.messageManager.spinner";
export default moduleName;

let module = angular
    .module(moduleName, [
        
    ]);
module.directive("spinner", SpinnerDirective.factory);
module.controller("SpinnerController", SpinnerController);
