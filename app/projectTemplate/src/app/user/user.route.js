/**
 * UserRoute
 * This service is to be initialized as a factory by calling the factory method.
 * The route configuration for the user module using ui-router
 */
export default class UserRoute {

    /**
     * initialize the routes for this module
     * @param $stateProvider ui router stateProvider
     */
    static initRoute($stateProvider){
        "ngInject";


        $stateProvider
            .state("users", {
                url: "/users",
                templateUrl: "app/user/user.list.html",
                controller: "UserController",
                controllerAs: "users"
            });


    }

}
