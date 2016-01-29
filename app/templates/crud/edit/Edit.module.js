import <%= _.capitalize(resourceName) %>EditRoute from "./<%= resourceName %>Edit.route";
import angularUiRouter from "angular-ui-router";
import <%= _.capitalize(resourceName) %>EditController from "./<%= resourceName %>Edit.controller";
import angular from "angular";

/*eslint no-unused-vars: 0*/
/**
 * Module <%= resourceName %>Edit
 * The module for creating, editing, and delete a <%= resourceName %>
 */
let moduleName = "app.<%= resourceName %>.<%= resourceName %>Edit";
export default moduleName;

let module = angular
    .module(moduleName, [
        
    
        angularUiRouter
    ]);
module.controller("<%= _.capitalize(resourceName) %>EditController", <%= _.capitalize(resourceName) %>EditController);
module.config(<%= _.capitalize(resourceName) %>EditRoute.initRoute);
