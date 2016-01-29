import angular from "angular";
import angularUiRouter from "angular-ui-router";
import picture from "./picture/picture.module";
import UserController from "./user.controller";
import UserResourceService from "./user.resource.service";
import UserRoute from "./user.route";
import userEdit from "./userEdit/userEdit.module";

/*eslint no-unused-vars: 0*/
/**
 * Module user
 * the user module
 */
let moduleName = "app.user";
export default moduleName;

let module = angular
    .module(moduleName, [
        angularUiRouter,
        userEdit,
        picture
    ]);
module.factory("userResourceService", UserResourceService.factory);
module.controller("UserController", UserController);
module.config(UserRoute.initRoute);
