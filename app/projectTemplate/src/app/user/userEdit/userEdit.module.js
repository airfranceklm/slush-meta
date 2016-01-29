import UserEditRoute from "./userEdit.route";
import angularUiRouter from "angular-ui-router";
import UserEditController from "./userEdit.controller";
import angular from "angular";

/*eslint no-unused-vars: 0*/
/**
 * Module userEdit
 * The module for creating, editing, and delete a user
 */
let moduleName = "app.user.userEdit";
export default moduleName;

let module = angular
    .module(moduleName, [
        
    
        angularUiRouter
    ]);
module.controller("UserEditController", UserEditController);
module.config(UserEditRoute.initRoute);
