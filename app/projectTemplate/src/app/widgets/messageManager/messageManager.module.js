import spinner from "./spinner/spinner.module";
import MessageManagerDirective from "./messageManager.directive";
import MessageManagerController from "./messageManager.controller";
import MessageService from "./message.service";
import angular from "angular";

/*eslint no-unused-vars: 0*/
/**
 * Module messageManager
 * Allows to display messages to the user to give him feedback on actions taken by the app
 */
let moduleName = "app.widgets.messageManager";
export default moduleName;

let module = angular
    .module(moduleName, [
        spinner
    ]);
module.service("message", MessageService);
module.controller("MessageManagerController", MessageManagerController);
module.directive("messageManager", MessageManagerDirective.factory);
