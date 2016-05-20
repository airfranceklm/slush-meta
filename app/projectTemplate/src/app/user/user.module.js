import picture from "./picture/picture.module";
import userEdit from "./userEdit/userEdit.module";
import UserRoute from "./user.route";
import angularUiRouter from "angular-ui-router";
import UserController from "./user.controller";
import UserResourceService from "./user.resource.service";
import angular from "angular";

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
