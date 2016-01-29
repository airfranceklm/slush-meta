import PictureRoute from "./picture.route";
import angularUiRouter from "angular-ui-router";
import angular from "angular";
import PictureFilter from "./picture.filter";
import PictureService from "./picture.service";
import PictureController from "./picture.controller";

/*eslint no-unused-vars: 0*/
/**
 * Module picture
 * The module responsible for the picture management of a user
 */
let moduleName = "app.user.picture";
export default moduleName;

let module = angular
    .module(moduleName, [

    
        angularUiRouter
    ]);

module.filter("pictureFilter", PictureFilter.factory);
module.controller("PictureController", PictureController);
module.service("pictureService", PictureService);
module.config(PictureRoute.initRoute);
