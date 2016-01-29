import <%= resourceName %>Edit from "./<%= resourceName %>Edit/<%= resourceName %>Edit.module";
import <%= _.capitalize(resourceName) %>Route from "./<%= resourceName %>.route";
import angularUiRouter from "angular-ui-router";
import <%= _.capitalize(resourceName) %>Controller from "./<%= resourceName %>.controller";
import <%= _.capitalize(resourceName) %>ResourceService from "./<%= resourceName %>.resource.service";
import angular from "angular";

/*eslint no-unused-vars: 0*/
/**
 * Module <%= resourceName %>
 * the <%= resourceName %> module
 */
let moduleName = "app.<%= resourceName %>";
export default moduleName;

let module = angular
    .module(moduleName, [
        angularUiRouter,
        <%= resourceName %>Edit
    ]);
module.factory("<%= resourceName %>ResourceService", <%= _.capitalize(resourceName) %>ResourceService.factory);
module.controller("<%= _.capitalize(resourceName) %>Controller", <%= _.capitalize(resourceName) %>Controller);
module.config(<%= _.capitalize(resourceName) %>Route.initRoute);
