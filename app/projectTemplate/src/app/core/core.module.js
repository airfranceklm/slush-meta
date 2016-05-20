import BackendLocatorService from "./backendLocator.service";
import HomeController from "./home.controller";
import angular from "angular";
import angularUiRouter from "angular-ui-router";
import angularUiBootstrap from "angular-ui-bootstrap";
import ngAnimate from "angular-animate";
import Route from "./core.route";

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
        ngAnimate
    ]);

module.config(Route.initRoute);
module.run(Route.shareUiRouter);

module.controller("HomeController", HomeController);
module.service("backendLocatorService", BackendLocatorService);
