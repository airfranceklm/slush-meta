/**
 * UserEditRoute
 * This service is to be initialized as a factory by calling the factory method.
 * The route configuration for the userEdit module using ui-router
 */
export default class UserEditRoute {

    /**
     * initialize the routes for this module
     * @param $stateProvider ui router stateProvider
     */
    static initRoute($stateProvider){
        "ngInject";


        $stateProvider
            .state("users.edit", {
                url: "/edit/:id",
                templateUrl: "app/user/userEdit/user.edit.html",
                controller: "UserEditController",
                controllerAs: "user"
            });


    }

}
