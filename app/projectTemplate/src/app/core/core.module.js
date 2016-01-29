import angular from "angular";
import ngAnimate from "angular-animate";
import angularUiBootstrap from "angular-ui-bootstrap";
import angularResource from "angular-resource";
import angularUiRouter from "angular-ui-router";
import BackendLocatorService from "./backendLocator.service";
import Route from "./core.route";
import HomeController from "./home.controller";

/*eslint no-unused-vars: 0*/
/**
 * Core module of the application
 */
let moduleName = "app.core";
export default moduleName;

let module = angular
    .module(moduleName, [
        angularUiRouter,
        angularUiBootstrap,
        angularResource,
        ngAnimate
    ]);

module.config(Route.initRoute);
module.run(Route.shareUiRouter);

module.controller("HomeController", HomeController);
module.service("backendLocatorService", BackendLocatorService);
